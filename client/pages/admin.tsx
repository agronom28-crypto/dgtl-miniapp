import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import axios from 'axios';
import s from '../styles/Admin.module.css';
var API='http://localhost:5001';
var FIELDS=['name','imageUrl','price','continent','country','resourceType','rarity','stakingRate','starsPrice','order','lat','lng'];
var NUMS=['price','stakingRate','starsPrice','order','lat','lng'];
var T={
  ru:{title:'DGTL Админ Панель',login:'Войти',logout:'Выйти',wrongToken:'Неверный токен',
    stats:'Статистика',users:'Пользователи',icons:'Месторождения',ops:'Операции',
    sites:'Месторождений',active:'Активных',usersN:'Пользователей',purchases:'Покупок',
    name:'Название',country:'Страна',resource:'Ресурс',price:'Цена',rate:'Рейт',activeCol:'Актив.',actions:'Действия',
    add:'+ Добавить',edit:'Редактировать',newSite:'Новое месторождение',save:'Сохранить',cancel:'Отмена',del:'Удал.',confirmDel:'Удалить?',
    search:'Поиск...',allRes:'Все ресурсы',allCountries:'Все страны',yes:'Да',no:'Нет',run:'Запустить',running:'Выполняю',
    tgId:'TG ID',username:'Ник',coins:'Монеты',editBal:'Изменить',saveBal:'Сохр.',cancelBal:'✕',
    gitPull:'Git Pull',gitPullDesc:'Обновить код с GitHub (git pull origin master)',gitPullWarn:'⚠ Сбросит все локальные изменения! Нужен рестарт серверов.',
    seedBoosts:'Seed Boosts',seedBoostsDesc:'Заполнить коллекцию буст-карточек в MongoDB',seedBoostsWarn:'Перезапишет существующие бусты.',
    reseed:'Reseed Sites',reseedDesc:'Перезаполнить месторождения из seedMiningSites.js',reseedWarn:'⚠ Перезапишет все месторождения!',
    clearCache:'Clear Cache',clearCacheDesc:'Очистить кэш Next.js (.next) и перекомпилировать',clearCacheWarn:'Сайт будет недоступен несколько секунд.',
    fixImg:'Fix Images',fixImgDesc:'Исправить пути картинок бустов на SVG',fixImgWarn:'Безопасная операция.',
    updPrices:'Update Prices',updPricesDesc:'Пересчитать starsPrice и stakingRate для всех иконок',updPricesWarn:'Изменит цены у всех месторождений!'},
  en:{title:'DGTL Admin Panel',login:'Login',logout:'Logout',wrongToken:'Wrong token',
    stats:'Stats',users:'Users',icons:'Icons',ops:'Operations',
    sites:'Sites',active:'Active',usersN:'Users',purchases:'Purchases',
    name:'Name',country:'Country',resource:'Resource',price:'Price',rate:'Rate',activeCol:'Active',actions:'Actions',
    add:'+ Add',edit:'Edit',newSite:'New Site',save:'Save',cancel:'Cancel',del:'Del',confirmDel:'Delete?',
    search:'Search...',allRes:'All resources',allCountries:'All countries',yes:'Yes',no:'No',run:'Run',running:'Running',
    tgId:'TG ID',username:'Username',coins:'Coins',editBal:'Edit',saveBal:'Save',cancelBal:'✕',
    gitPull:'Git Pull',gitPullDesc:'Update code from GitHub (git pull origin master)',gitPullWarn:'\u26a0 Resets all local changes! Requires server restart.',
    seedBoosts:'Seed Boosts',seedBoostsDesc:'Fill boosts-cards collection in MongoDB',seedBoostsWarn:'Will overwrite existing boosts.',
    reseed:'Reseed Sites',reseedDesc:'Re-seed mining sites from seedMiningSites.js',reseedWarn:'\u26a0 Will overwrite all mining sites!',
    clearCache:'Clear Cache',clearCacheDesc:'Clear Next.js cache (.next) and recompile',clearCacheWarn:'Site will be unavailable for a few seconds.',
    fixImg:'Fix Images',fixImgDesc:'Fix boost card image paths to SVG',fixImgWarn:'Safe operation.',
    updPrices:'Update Prices',updPricesDesc:'Recalculate starsPrice and stakingRate for all icons',updPricesWarn:'Will change prices for all sites!'}
};
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
  var _ln=useState('ru'),lang=_ln[0],setLang=_ln[1];
var _eb=useState(null),editBalanceId=_eb[0],setEditBalanceId=_eb[1];var _ebv=useState(''),editBalanceVal=_ebv[0],setEditBalanceVal=_ebv[1];
  var t=T[lang];
  var hdr={headers:{'x-admin-token':token}};
  function load(){
    if(tab==='stats')axios.get(API+'/api/admin/stats',hdr).then(function(r){setStats(r.data.stats)}).catch(function(){});
    if(tab==='users')axios.get(API+'/api/admin/users',hdr).then(function(r){setUsers(r.data.users||[])}).catch(function(){});
    if(tab==='icons')axios.get(API+'/api/admin/icons',hdr).then(function(r){setIcons(r.data.icons||[])}).catch(function(){});
  }
  useEffect(function(){if(auth)load()},[auth,tab,token]);
  function login(){axios.get(API+'/api/admin/stats',{headers:{'x-admin-token':inp}}).then(function(r){if(r.data.success){setToken(inp);setAuth(true);setStats(r.data.stats)}}).catch(function(){alert(t.wrongToken)})}
  function runOp(p,l){setBusy(true);setOpRes(t.running+': '+l+'...');axios.get(API+'/api/admin'+p,hdr).then(function(r){setOpRes(JSON.stringify(r.data,null,2));setBusy(false)}).catch(function(e){setOpRes('Error: '+e.message);setBusy(false)})}
  
function saveBalance(userId,val){axios.put(API+'/api/admin/users/'+userId+'/balance',{coins:Number(val)},hdr).then(function(){setEditBalanceId(null);setEditBalanceVal('');load()}).catch(function(e){alert(e.message)})}
function delIcon(id){if(!confirm(t.confirmDel))return;axios.delete(API+'/api/admin/icons/'+id,hdr).then(function(){load()}).catch(function(e){alert(e.message)})}
  function saveIcon(){var d=Object.assign({},modal);NUMS.forEach(function(k){d[k]=Number(d[k])||0});var p=d._id?axios.put(API+'/api/admin/icons/'+d._id,d,hdr):axios.post(API+'/api/admin/icons',d,hdr);p.then(function(){setModal(null);load()}).catch(function(e){alert(e.message)})}
  function uf(f,v){var o=Object.assign({},modal);o[f]=v;setModal(o)}
  function newIcon(){setModal({name:'',imageUrl:'',price:0,continent:'',country:'',resourceType:'',rarity:'common',stakingRate:10,starsPrice:0,isActive:true,order:0,lat:0,lng:0})}
  function tgSort(col){setSortCfg(function(p){return{col:col,dir:p.col===col&&p.dir==='asc'?'desc':'asc'}})}
  var resTypes=useMemo(function(){var s=new Set();icons.forEach(function(i){if(i.resourceType)s.add(i.resourceType)});return Array.from(s).sort()},[icons]);
  var ctrs=useMemo(function(){var s=new Set();icons.forEach(function(i){if(i.country)s.add(i.country)});return Array.from(s).sort()},[icons]);
  var fi=useMemo(function(){var l=icons.filter(function(i){if(search&&!(i.name||'').toLowerCase().includes(search.toLowerCase())&&!(i.country||'').toLowerCase().includes(search.toLowerCase()))return false;if(filterRes!=='all'&&i.resourceType!==filterRes)return false;if(filterCountry!=='all'&&i.country!==filterCountry)return false;return true});l.sort(function(a,b){var av=a[sortCfg.col],bv=b[sortCfg.col];if(typeof av==='string')av=(av||'').toLowerCase();if(typeof bv==='string')bv=(bv||'').toLowerCase();if(av<bv)return sortCfg.dir==='asc'?-1:1;if(av>bv)return sortCfg.dir==='asc'?1:-1;return 0});return l},[icons,search,filterRes,filterCountry,sortCfg]);
  var h=React.createElement;
  function sh(col,label){var ar=sortCfg.col===col?(sortCfg.dir==='asc'?' \u25B2':' \u25BC'):'';return h('th',{key:col,style:{cursor:'pointer'},onClick:function(){tgSort(col)}},label+ar)}
  var OPS=[['/git-pull',t.gitPull,t.gitPullDesc,t.gitPullWarn],['/seed-boosts',t.seedBoosts,t.seedBoostsDesc,t.seedBoostsWarn],['/reseed-mining-sites',t.reseed,t.reseedDesc,t.reseedWarn],['/clear-cache',t.clearCache,t.clearCacheDesc,t.clearCacheWarn],['/fix-boost-images',t.fixImg,t.fixImgDesc,t.fixImgWarn],['/icons/update-prices',t.updPrices,t.updPricesDesc,t.updPricesWarn]];
  var langToggle=h('div',{style:{display:'flex',alignItems:'center',gap:6,marginLeft:16}},h('span',{style:{color:lang==='ru'?'#f5a623':'#666',fontWeight:lang==='ru'?700:400,cursor:'pointer',fontSize:14},onClick:function(){setLang('ru')}},'RU'),h('div',{onClick:function(){setLang(lang==='ru'?'en':'ru')},style:{width:44,height:24,borderRadius:12,background:lang==='ru'?'#f5a623':'#555',cursor:'pointer',position:'relative',transition:'background 0.2s'}},h('div',{style:{width:20,height:20,borderRadius:10,background:'#fff',position:'absolute',top:2,left:lang==='ru'?2:22,transition:'left 0.2s'}})),h('span',{style:{color:lang==='en'?'#f5a623':'#666',fontWeight:lang==='en'?700:400,cursor:'pointer',fontSize:14},onClick:function(){setLang('en')}},'EN'));
  if(!auth)return h('div',{className:s.container},h(Head,null,h('title',null,'DGTL Admin')),h('div',{className:s.loginBox},h('h1',null,'DGTL Admin'),h('input',{type:'password',placeholder:'Admin token',value:inp,onChange:function(e){setInp(e.target.value)},onKeyDown:function(e){if(e.key==='Enter')login()}}),h('button',{className:s.btn,onClick:login},t.login)));
  var selSt={padding:'8px 12px',borderRadius:8,border:'1px solid #333',background:'#1a1a1a',color:'#fff',fontSize:13};
  var TABLIST=[['stats',t.stats],['users',t.users],['icons',t.icons+' ('+icons.length+')'],['ops',t.ops]];
  return h('div',{className:s.container},
    h(Head,null,h('title',null,'DGTL Admin')),
    h('div',{className:s.header},h('div',{style:{display:'flex',alignItems:'center'}},h('h1',null,t.title),langToggle),h('button',{className:s.btn,onClick:function(){setAuth(false);setToken('')}},t.logout)),
    h('div',{className:s.tabs},TABLIST.map(function(x){return h('button',{key:x[0],className:tab===x[0]?s.tabActive:s.tab,onClick:function(){setTab(x[0])}},x[1])})),
    tab==='stats'&&stats&&h('div',{className:s.grid},[[t.sites,stats.totalIcons],[t.active,stats.activeIcons],[t.usersN,stats.totalUsers],[t.purchases,stats.totalPurchases]].map(function(x,i){return h('div',{key:i,className:s.card},h('h3',null,x[0]),h('div',{className:s.val},x[1]))})),
    tab==='users'&&h('table',{className:s.table},h('thead',null,h('tr',null,['#',t.tgId,t.name,t.username,t.coins,''].map(function(x){return h('th',{key:x||'act'},x)}))),h('tbody',null,users.map(function(u,i){return h('tr',{key:u._id},h('td',null,i+1),h('td',null,u.telegramId),h('td',null,(u.firstName||'')+' '+(u.lastName||'')),h('td',null,u.username?'@'+u.username:'-'),h('td',{style:{color:'#f5a623',fontWeight:700}},editBalanceId===u._id?h('input',{type:'number',value:editBalanceVal,onChange:function(e){setEditBalanceVal(e.target.value)},style:{width:90,padding:'4px 6px',borderRadius:4,border:'1px solid #f5a623',background:'#1a1a1a',color:'#f5a623',fontWeight:700},autoFocus:true,onKeyDown:function(e){if(e.key==='Enter')saveBalance(u._id,editBalanceVal);if(e.key==='Escape'){setEditBalanceId(null);setEditBalanceVal('')}}}):u.coins),h('td',null,editBalanceId===u._id?h('span',{style:{display:'flex',gap:4}},h('button',{className:s.btn,style:{padding:'2px 8px',fontSize:11},onClick:function(){saveBalance(u._id,editBalanceVal)}},t.saveBal),h('button',{className:s.btnSmall,style:{padding:'2px 6px',fontSize:11},onClick:function(){setEditBalanceId(null);setEditBalanceVal('')}},t.cancelBal)):h('button',{className:s.btnSmall,style:{padding:'2px 8px',fontSize:11},onClick:function(){setEditBalanceId(u._id);setEditBalanceVal(String(u.coins))}},t.editBal)))}))),
    tab==='icons'&&h('div',null,
      h('div',{style:{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}},
        h('button',{className:s.btn,onClick:newIcon},t.add),
        h('input',{placeholder:t.search,value:search,onChange:function(e){setSearch(e.target.value)},style:Object.assign({},selSt,{width:180})}),
        h('select',{value:filterRes,onChange:function(e){setFilterRes(e.target.value)},style:selSt},h('option',{value:'all'},t.allRes),resTypes.map(function(r){return h('option',{key:r,value:r},r)})),
        h('select',{value:filterCountry,onChange:function(e){setFilterCountry(e.target.value)},style:selSt},h('option',{value:'all'},t.allCountries),ctrs.map(function(r){return h('option',{key:r,value:r},r)})),
        h('span',{style:{color:'#888',fontSize:12}},fi.length+'/'+icons.length)
      ),
      h('table',{className:s.table},
        h('thead',null,h('tr',null,[sh('name',t.name),sh('country',t.country),sh('resourceType',t.resource),sh('price',t.price),sh('starsPrice','Stars'),sh('stakingRate',t.rate),sh('isActive',t.activeCol),h('th',{key:'a'},t.actions)])),
        h('tbody',null,fi.map(function(ic){return h('tr',{key:ic._id},h('td',null,ic.name),h('td',null,ic.country),h('td',null,ic.resourceType),h('td',null,ic.price),h('td',null,ic.starsPrice||'-'),h('td',null,ic.stakingRate),h('td',{style:{color:ic.isActive?'#2ecc71':'#e74c3c'}},ic.isActive?t.yes:t.no),h('td',null,h('button',{className:s.btnSmall,onClick:function(){setModal(Object.assign({},ic))}},t.edit),h('button',{className:s.btnDanger,onClick:function(){delIcon(ic._id)}},t.del)))}))
      )),
    tab==='ops'&&h('div',null,
      h('div',{className:s.opsGrid},OPS.map(function(x){return h('div',{key:x[0],className:s.opCard},h('h3',null,x[1]),h('p',{style:{color:'#aaa',fontSize:12,margin:'4px 0'}},x[2]),h('p',{style:{color:'#e74c3c',fontSize:11,margin:'2px 0 8px'}},x[3]),h('button',{className:s.btn,disabled:busy,onClick:function(){runOp(x[0],x[1])}},busy?'...':t.run))})),
      opRes&&h('div',{className:s.result},opRes)),
    modal&&h('div',{className:s.modal,onClick:function(e){if(e.target===e.currentTarget)setModal(null)}},h('div',{className:s.modalBox},h('h2',null,modal._id?t.edit:t.newSite),h('div',{className:s.formGrid},FIELDS.map(function(f){return h('label',{key:f},f,h('input',{value:modal[f]!=null?modal[f]:'',onChange:function(e){uf(f,e.target.value)}}))}),h('label',null,'isActive',h('select',{value:modal.isActive?'true':'false',onChange:function(e){uf('isActive',e.target.value==='true')}},h('option',{value:'true'},t.yes),h('option',{value:'false'},t.no)))),h('div',{className:s.formActions},h('button',{className:s.btnDanger,onClick:function(){setModal(null)}},t.cancel),h('button',{className:s.btn,onClick:saveIcon},t.save))))
  );
}