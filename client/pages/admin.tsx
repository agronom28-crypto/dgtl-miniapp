import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import axios from 'axios';
import s from '../styles/Admin.module.css';
var API='http://localhost:5001';
var FIELDS=['name','imageUrl','price','continent','country','resourceType','rarity','stakingRate','starsPrice','order','lat','lng'];
var NUMS=['price','stakingRate','starsPrice','order','lat','lng'];
export default function AdminPage(){
  var _s=useState(''),token=_s[0],setToken=_s[1];var _a=useState(false),auth=_a[0],setAuth=_a[1];
  var _i=useState(''),inp=_i[0],setInp=_i[1];var _t=useState('stats'),tab=_t[0],setTab=_t[1];
  var _st=useState(null),stats=_st[0],setStats=_st[1];var _u=useState([]),users=_u[0],setUsers=_u[1];
  var _ic=useState([]),icons=_ic[0],setIcons=_ic[1];var _o=useState(''),opRes=_o[0],setOpRes=_o[1];
  var _b=useState(false),busy=_b[0],setBusy=_b[1];var _m=useState(null),modal=_m[0],setModal=_m[1];
  var _sr=useState(''),search=_sr[0],setSearch=_sr[1];
  var _fr=useState('all'),filterRes=_fr[0],setFilterRes=_fr[1];
  var _fc=useState('all'),filterCountry=_fc[0],setFilterCountry=_fc[1];
  var _so=useState({col:'name',dir:'asc'}),sortCfg=_so[0],setSortCfg=_so[1];
  var hdr={headers:{'x-admin-token':token}};
  function load(){
    if(tab==='stats')axios.get(API+'/api/admin/stats',hdr).then(function(r){setStats(r.data.stats)}).catch(function(){});
    if(tab==='users')axios.get(API+'/api/admin/users',hdr).then(function(r){setUsers(r.data.users||[])}).catch(function(){});
    if(tab==='icons')axios.get(API+'/api/admin/icons',hdr).then(function(r){setIcons(r.data.icons||[])}).catch(function(){});
  }
  useEffect(function(){if(auth)load()},[auth,tab,token]);
  function login(){axios.get(API+'/api/admin/stats',{headers:{'x-admin-token':inp}}).then(function(r){if(r.data.success){setToken(inp);setAuth(true);setStats(r.data.stats)}}).catch(function(){alert('Wrong token')})}
  function runOp(p,l){setBusy(true);setOpRes('Running: '+l);axios.get(API+'/api/admin'+p,hdr).then(function(r){setOpRes(JSON.stringify(r.data,null,2));setBusy(false)}).catch(function(e){setOpRes('Error: '+e.message);setBusy(false)})}
  function delIcon(id){if(!confirm('Delete?'))return;axios.delete(API+'/api/admin/icons/'+id,hdr).then(function(){load()}).catch(function(e){alert(e.message)})}
  function saveIcon(){var d=Object.assign({},modal);NUMS.forEach(function(k){d[k]=Number(d[k])||0});var p=d._id?axios.put(API+'/api/admin/icons/'+d._id,d,hdr):axios.post(API+'/api/admin/icons',d,hdr);p.then(function(){setModal(null);load()}).catch(function(e){alert(e.message)})}
  function uf(f,v){var o=Object.assign({},modal);o[f]=v;setModal(o)}
  function newIcon(){setModal({name:'',imageUrl:'',price:0,continent:'',country:'',resourceType:'',rarity:'common',stakingRate:10,starsPrice:0,isActive:true,order:0,lat:0,lng:0})}
  function tgSort(col){setSortCfg(function(p){return{col:col,dir:p.col===col&&p.dir==='asc'?'desc':'asc'}})}
  var resTypes=useMemo(function(){var s=new Set();icons.forEach(function(i){if(i.resourceType)s.add(i.resourceType)});return Array.from(s).sort()},[icons]);
  var ctrs=useMemo(function(){var s=new Set();icons.forEach(function(i){if(i.country)s.add(i.country)});return Array.from(s).sort()},[icons]);
  var fi=useMemo(function(){var l=icons.filter(function(i){if(search&&!(i.name||'').toLowerCase().includes(search.toLowerCase())&&!(i.country||'').toLowerCase().includes(search.toLowerCase()))return false;if(filterRes!=='all'&&i.resourceType!==filterRes)return false;if(filterCountry!=='all'&&i.country!==filterCountry)return false;return true});l.sort(function(a,b){var av=a[sortCfg.col],bv=b[sortCfg.col];if(typeof av==='string')av=(av||'').toLowerCase();if(typeof bv==='string')bv=(bv||'').toLowerCase();if(av<bv)return sortCfg.dir==='asc'?-1:1;if(av>bv)return sortCfg.dir==='asc'?1:-1;return 0});return l},[icons,search,filterRes,filterCountry,sortCfg]);
  var h=React.createElement;
  function sh(col,label){var ar=sortCfg.col===col?(sortCfg.dir==='asc'?' \u25B2':' \u25BC'):'';return h('th',{key:col,style:{cursor:'pointer'},onClick:function(){tgSort(col)}},label+ar)}
  if(!auth)return h('div',{className:s.container},h(Head,null,h('title',null,'DGTL Admin')),h('div',{className:s.loginBox},h('h1',null,'DGTL Admin'),h('input',{type:'password',placeholder:'Admin token',value:inp,onChange:function(e){setInp(e.target.value)},onKeyDown:function(e){if(e.key==='Enter')login()}}),h('button',{className:s.btn,onClick:login},'Login')));
  var TABS=[['stats','Stats'],['users','Users'],['icons','Icons ('+icons.length+')'],['ops','Ops']];
  var selSt={padding:'8px 12px',borderRadius:8,border:'1px solid #333',background:'#1a1a1a',color:'#fff',fontSize:13};
  return h('div',{className:s.container},
    h(Head,null,h('title',null,'DGTL Admin')),
    h('div',{className:s.header},h('h1',null,'DGTL Admin Panel'),h('button',{className:s.btn,onClick:function(){setAuth(false);setToken('')}},'Logout')),
    h('div',{className:s.tabs},TABS.map(function(t){return h('button',{key:t[0],className:tab===t[0]?s.tabActive:s.tab,onClick:function(){setTab(t[0])}},t[1])})),
    tab==='stats'&&stats&&h('div',{className:s.grid},[['Sites',stats.totalIcons],['Active',stats.activeIcons],['Users',stats.totalUsers],['Purchases',stats.totalPurchases]].map(function(x,i){return h('div',{key:i,className:s.card},h('h3',null,x[0]),h('div',{className:s.val},x[1]))})),
    tab==='users'&&h('table',{className:s.table},h('thead',null,h('tr',null,['#','TG ID','Name','Username','Coins'].map(function(x){return h('th',{key:x},x)}))),h('tbody',null,users.map(function(u,i){return h('tr',{key:u._id},h('td',null,i+1),h('td',null,u.telegramId),h('td',null,(u.firstName||'')+' '+(u.lastName||'')),h('td',null,u.username?'@'+u.username:'-'),h('td',{style:{color:'#f5a623',fontWeight:700}},u.coins))}))),
    tab==='icons'&&h('div',null,
      h('div',{style:{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}},
        h('button',{className:s.btn,onClick:newIcon},'+ Add'),
        h('input',{placeholder:'Search...',value:search,onChange:function(e){setSearch(e.target.value)},style:Object.assign({},selSt,{width:180})}),
        h('select',{value:filterRes,onChange:function(e){setFilterRes(e.target.value)},style:selSt},h('option',{value:'all'},'All resources'),resTypes.map(function(r){return h('option',{key:r,value:r},r)})),
        h('select',{value:filterCountry,onChange:function(e){setFilterCountry(e.target.value)},style:selSt},h('option',{value:'all'},'All countries'),ctrs.map(function(r){return h('option',{key:r,value:r},r)})),
        h('span',{style:{color:'#888',fontSize:12}},fi.length+'/'+icons.length)
      ),
      h('table',{className:s.table},
        h('thead',null,h('tr',null,[sh('name','Name'),sh('country','Country'),sh('resourceType','Resource'),sh('price','Price'),sh('starsPrice','Stars'),sh('stakingRate','Rate'),sh('isActive','Active'),h('th',{key:'a'},'Actions')])),
        h('tbody',null,fi.map(function(ic){return h('tr',{key:ic._id},h('td',null,ic.name),h('td',null,ic.country),h('td',null,ic.resourceType),h('td',null,ic.price),h('td',null,ic.starsPrice||'-'),h('td',null,ic.stakingRate),h('td',{style:{color:ic.isActive?'#2ecc71':'#e74c3c'}},ic.isActive?'Yes':'No'),h('td',null,h('button',{className:s.btnSmall,onClick:function(){setModal(Object.assign({},ic))}},'Edit'),h('button',{className:s.btnDanger,onClick:function(){delIcon(ic._id)}},'Del')))}))
      )),
    tab==='ops'&&h('div',null,h('div',{className:s.opsGrid},[['/git-pull','Git Pull'],['/seed-boosts','Seed Boosts'],['/reseed-mining-sites','Reseed'],['/clear-cache','Clear Cache'],['/fix-boost-images','Fix Images'],['/icons/update-prices','Update Prices']].map(function(x){return h('div',{key:x[0],className:s.opCard},h('h3',null,x[1]),h('button',{className:s.btn,disabled:busy,onClick:function(){runOp(x[0],x[1])}},busy?'...':'Run'))})),opRes&&h('div',{className:s.result},opRes)),
    modal&&h('div',{className:s.modal,onClick:function(e){if(e.target===e.currentTarget)setModal(null)}},h('div',{className:s.modalBox},h('h2',null,modal._id?'Edit':'New Site'),h('div',{className:s.formGrid},FIELDS.map(function(f){return h('label',{key:f},f,h('input',{value:modal[f]!=null?modal[f]:'',onChange:function(e){uf(f,e.target.value)}}))}),h('label',null,'isActive',h('select',{value:modal.isActive?'true':'false',onChange:function(e){uf('isActive',e.target.value==='true')}},h('option',{value:'true'},'Yes'),h('option',{value:'false'},'No')))),h('div',{className:s.formActions},h('button',{className:s.btnDanger,onClick:function(){setModal(null)}},'Cancel'),h('button',{className:s.btn,onClick:saveIcon},'Save'))))
  );
}