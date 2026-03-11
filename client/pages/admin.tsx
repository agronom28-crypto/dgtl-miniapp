import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import s from '../styles/Admin.module.css';

var API = 'http://localhost:5001';
var FIELDS = ['name','imageUrl','price','continent','country','resourceType','rarity','stakingRate','starsPrice','order','lat','lng'];
var NUMS = ['price','stakingRate','starsPrice','order','lat','lng'];

export default function AdminPage() {
  var _s=useState(''),token=_s[0],setToken=_s[1];
  var _a=useState(false),auth=_a[0],setAuth=_a[1];
  var _i=useState(''),inp=_i[0],setInp=_i[1];
  var _t=useState('stats'),tab=_t[0],setTab=_t[1];
  var _st=useState(null),stats=_st[0],setStats=_st[1];
  var _u=useState([]),users=_u[0],setUsers=_u[1];
  var _ic=useState([]),icons=_ic[0],setIcons=_ic[1];
  var _o=useState(''),opRes=_o[0],setOpRes=_o[1];
  var _b=useState(false),busy=_b[0],setBusy=_b[1];
  var _m=useState(null),modal=_m[0],setModal=_m[1];
  var hdr={headers:{'x-admin-token':token}};
  function load(){
    if(tab==='stats')axios.get(API+'/api/admin/stats',hdr).then(function(r){setStats(r.data.stats)}).catch(function(){});
    if(tab==='users')axios.get(API+'/api/admin/users',hdr).then(function(r){setUsers(r.data.users||[])}).catch(function(){});
    if(tab==='icons')axios.get(API+'/api/admin/icons',hdr).then(function(r){setIcons(r.data.icons||[])}).catch(function(){});
  }
  useEffect(function(){ if(auth) load(); },[auth,tab,token]);
  function login(){
    axios.get(API+'/api/admin/stats',{headers:{'x-admin-token':inp}}).then(function(r){
      if(r.data.success){setToken(inp);setAuth(true);setStats(r.data.stats)}
    }).catch(function(){alert('Wrong token')})
  }
  function runOp(path,label){
    setBusy(true);setOpRes('Running: '+label);
    axios.get(API+'/api/admin'+path).then(function(r){setOpRes(JSON.stringify(r.data,null,2));setBusy(false)}).catch(function(e){setOpRes('Error: '+e.message);setBusy(false)})
  }
  function delIcon(id){
    if(!confirm('Delete this icon?'))return;
    axios.delete(API+'/api/admin/icons/'+id,hdr).then(function(){load()}).catch(function(e){alert(e.message)})
  }
  function saveIcon(){
    var data=Object.assign({},modal);
    NUMS.forEach(function(k){data[k]=Number(data[k])||0});
    var p=data._id?axios.put(API+'/api/admin/icons/'+data._id,data,hdr):axios.post(API+'/api/admin/icons',data,hdr);
    p.then(function(){setModal(null);load()}).catch(function(e){alert(e.message)})
  }
  function uf(field,val){var o=Object.assign({},modal);o[field]=val;setModal(o)}
  function newIcon(){setModal({name:'',imageUrl:'',price:0,continent:'',country:'',resourceType:'',rarity:'common',stakingRate:10,starsPrice:0,isActive:true,order:0,lat:0,lng:0})}
  var h=React.createElement;
  if(!auth)return h('div',{className:s.container},
    h(Head,null,h('title',null,'DGTL Admin')),
    h('div',{className:s.loginBox},
      h('h1',null,'DGTL Admin'),
      h('input',{type:'password',placeholder:'Admin token',value:inp,onChange:function(e){setInp(e.target.value)},onKeyDown:function(e){if(e.key==='Enter')login()}}),
      h('button',{className:s.btn,onClick:login},'Login')
    )
  );
  var TABS=[['stats','Stats'],['users','Users'],['icons','Icons'],['ops','Ops']];
  return h('div',{className:s.container},
    h(Head,null,h('title',null,'DGTL Admin')),
    h('div',{className:s.header},
      h('h1',null,'DGTL Admin Panel'),
      h('button',{className:s.btn,onClick:function(){setAuth(false);setToken('')}},'Logout')
    ),
    h('div',{className:s.tabs},
      TABS.map(function(t){return h('button',{key:t[0],className:tab===t[0]?s.tabActive:s.tab,onClick:function(){setTab(t[0])}},t[1])})
    ),
    tab==='stats'&&stats&&h('div',{className:s.grid},
      [['Sites',stats.totalIcons],['Active',stats.activeIcons],['Users',stats.totalUsers],['Purchases',stats.totalPurchases]].map(function(x,i){return h('div',{key:i,className:s.card},h('h3',null,x[0]),h('div',{className:s.val},x[1]))})
    ),
    tab==='users'&&h('table',{className:s.table},
      h('thead',null,h('tr',null,['#','TG ID','Name','Username','Coins'].map(function(x){return h('th',{key:x},x)}))),
      h('tbody',null,users.map(function(u,i){return h('tr',{key:u._id},h('td',null,i+1),h('td',null,u.telegramId),h('td',null,(u.firstName||'')+' '+(u.lastName||'')),h('td',null,u.username?'@'+u.username:'-'),h('td',{style:{color:'#f5a623',fontWeight:700}},u.coins))}))
    ),
    tab==='icons'&&h('div',null,
      h('button',{className:s.btn,style:{marginBottom:16},onClick:newIcon},'+ Add Site'),
      h('table',{className:s.table},
        h('thead',null,h('tr',null,['Name','Country','Resource','Price','Stars','Rate','Active','Actions'].map(function(x){return h('th',{key:x},x)}))),
        h('tbody',null,icons.map(function(ic){return h('tr',{key:ic._id},h('td',null,ic.name),h('td',null,ic.country),h('td',null,ic.resourceType),h('td',null,ic.price),h('td',null,ic.starsPrice||'-'),h('td',null,ic.stakingRate),h('td',{style:{color:ic.isActive?'#2ecc71':'#e74c3c'}},ic.isActive?'Yes':'No'),h('td',null,h('button',{className:s.btnSmall,onClick:function(){setModal(Object.assign({},ic))}},'Edit'),h('button',{className:s.btnDanger,onClick:function(){delIcon(ic._id)}},'Del')))}))
      )
    ),
    tab==='ops'&&h('div',null,
      h('div',{className:s.opsGrid},
        [['/git-pull','Git Pull'],['/seed-boosts','Seed Boosts'],['/reseed-mining-sites','Reseed'],['/clear-cache','Clear Cache'],['/fix-boost-images','Fix Images'],['/icons/update-prices','Update Prices']].map(function(x){return h('div',{key:x[0],className:s.opCard},h('h3',null,x[1]),h('button',{className:s.btn,disabled:busy,onClick:function(){runOp(x[0],x[1])}},busy?'...':'Run'))})
      ),
      opRes&&h('div',{className:s.result},opRes)
    ),
    modal&&h('div',{className:s.modal,onClick:function(e){if(e.target===e.currentTarget)setModal(null)}},
      h('div',{className:s.modalBox},
        h('h2',null,modal._id?'Edit Site':'New Site'),
        h('div',{className:s.formGrid},
          FIELDS.map(function(f){return h('label',{key:f},f,h('input',{value:modal[f]!=null?modal[f]:'',onChange:function(e){uf(f,e.target.value)}}))}),
          h('label',null,'isActive',h('select',{value:modal.isActive?'true':'false',onChange:function(e){uf('isActive',e.target.value==='true')}},h('option',{value:'true'},'Yes'),h('option',{value:'false'},'No')))
        ),
        h('div',{className:s.formActions},
          h('button',{className:s.btnDanger,onClick:function(){setModal(null)}},'Cancel'),
          h('button',{className:s.btn,onClick:saveIcon},'Save')
        )
      )
    )
  );
}