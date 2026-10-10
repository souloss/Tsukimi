import"./disclose-version.DwdwGuwu.js";import{$ as De,A as p,C as ke,F as H,G as b,H as f,I as Ie,J as ve,K as pe,L as n,M as S,O,P as Q,Q as Y,S as Pe,T as Ve,U as ee,V as He,W as N,X as ie,Z as G,_ as Ce,b as Re,et as m,g as Be,h as qe,j as ae,l as T,m as K,nt as Fe,p as Se,q as fe,t as te,x as A,y as Ae,z as V}from"./client.BLHVEdAV.js";import{t as R}from"./LocalIcon.Gi2SHDVG.js";import{n as D,t as I}from"./translation.DX9TqyXn.js";import{o as me}from"./config.BuOFpMPB.js";import{t as k}from"./musicPlayerStore.0D5pE76g.js";import{a as ye,c as Ne,i as Ke,l as Xe,n as je,o as We,r as Ue,s as Oe,t as Ye}from"./SidebarTrackInfo.CIGdi2Gu.js";function Ge(l){const e=l-1;return e*e*e+1}function Te(l){const e=l-1;return e*e*e+1}function he(l){const e=typeof l=="string"&&l.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[l,"px"]}function ne(l,e,t){return Number.isNaN(e)?"":`${l}: ${t*e}px;`}function Je(l,{delay:e=0,duration:t=400,easing:u=Te,x:r=0,y:a=0,opacity:h=0}={}){const s=getComputedStyle(l),P=+s.opacity,i=s.transform==="none"?"":s.transform,c=P*(1-h),[v,d]=he(r),[w,_]=he(a);return{delay:e,duration:t,easing:u,css:(o,z)=>`
			transform: ${i} translate(${(1-o)*v}${d}, ${(1-o)*w}${_});
			opacity: ${P-c*z}`}}function Qe(l,{delay:e=0,duration:t=400,easing:u=Te,axis:r="y"}={}){const a=getComputedStyle(l),h=+a.opacity,s=r==="y"?"height":"width",P=parseFloat(a[s]),i=r==="y"?["top","bottom"]:["left","right"],c=i.map(y=>`${y[0].toUpperCase()}${y.slice(1)}`),v=parseFloat(a[`padding${c[0]}`]),d=parseFloat(a[`padding${c[1]}`]),w=parseFloat(a[`margin${c[0]}`]),_=parseFloat(a[`margin${c[1]}`]),o=parseFloat(a[`border${c[0]}Width`]),z=parseFloat(a[`border${c[1]}Width`]);return{delay:e,duration:t,easing:u,css:y=>`overflow: hidden;opacity: ${Math.min(y*20,1)*h};`+ne(s,P,y)+ne(`padding-${i[0]}`,v,y)+ne(`padding-${i[1]}`,d,y)+ne(`margin-${i[0]}`,w,y)+ne(`margin-${i[1]}`,_,y)+ne(`border-${i[0]}-width`,o,y)+ne(`border-${i[1]}-width`,z,y)+`min-${s}: 0`}}var Ze=S('<div id="music-player-panel" class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg" role="region"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function $e(l,e){Y(e,!0);let t=ve(pe(k.getState())),u=ve(!1);function r(M){const B=M;B.detail&&fe(t,B.detail,!0)}ke(()=>{window.addEventListener("music-sidebar:state",r)}),Pe(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",r)});function a(){k.toggle()}function h(){k.prev()}function s(){k.next()}function P(){k.toggleMode()}function i(){fe(u,!n(u))}function c(M){k.playIndex(M)}function v(M){k.seek(M)}function d(){k.toggleMute()}function w(M){k.setVolume(M)}var _=Ze(),o=f(_),z=f(o);Ke(z,{get currentSong(){return n(t).currentSong},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading}});var y=b(z,2);Ye(y,{get currentSong(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},onToggleMute:d,onSetVolume:w}),m(o);var q=b(o,2);je(q,{get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},onSeek:v});var C=b(q,2);We(C,{get isPlaying(){return n(t).isPlaying},get isShuffled(){return n(t).isShuffled},get repeatMode(){return n(t).isRepeating},onToggleMode:P,onPrev:h,onNext:s,onTogglePlay:a,onTogglePlaylist:i});var g=b(C,2);Ue(g,{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(u)},onClose:i,onPlaySong:c}),m(_),V(M=>T(_,"aria-label",M),[()=>I(D.musicPlayer)]),p(l,_),G()}var et=S('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),tt=S('<div class="text-xs text-30 mt-1"> </div>'),nt=S('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function xe(l,e){Y(e,!0);const t=te(e,"showTime",3,!1),u=te(e,"size",3,"mini");function r(i){return!Number.isFinite(i)||i<0?"0:00":`${Math.floor(i/60)}:${Math.floor(i%60).toString().padStart(2,"0")}`}var a=ae(),h=ee(a),s=i=>{var c=et(),v=f(c),d=N(v,!0),w=b(v,2),_=N(w,!0);m(c),V(()=>{O(d,e.song.title),O(_,e.song.artist)}),p(i,c)},P=i=>{var c=nt(),v=f(c),d=N(v,!0),w=b(v,2),_=N(w,!0),o=b(w,2),z=y=>{var q=tt(),C=N(q);V((g,M)=>O(C,`${g??""} / ${M??""}`),[()=>r(e.currentTime),()=>r(e.duration)]),p(y,q)};A(o,y=>{t()&&y(z)}),m(c),V(()=>{O(d,e.song.title),O(_,e.song.artist)}),p(i,c)};A(h,i=>{u()==="mini"?i(s):i(P,-1)}),p(l,a),G()}var it=S('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),rt=S('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),at=S("<!> <!> <!>",1),ot=S("<div><!></div>");function Me(l,e){Y(e,!0);const t=te(e,"size",3,"mini"),u=te(e,"showControls",3,!1),r=te(e,"showPlaylist",3,!1);var a=ot(),h=f(a),s=i=>{var c=it(),v=ee(c);ye(v,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",interactive:!0,get onclick(){return e.onCoverClick}});var d=b(v,2),w=f(d);xe(w,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},size:"mini"}),m(d);var _=b(d,2),o=f(_),z=f(o);R(z,{icon:"material-symbols:visibility-off",class:"text-lg"}),m(o);var y=b(o,2),q=f(y);R(q,{icon:"material-symbols:expand-less",class:"text-lg"}),m(y),m(_),V((C,g,M,B)=>{T(d,"aria-label",C),T(o,"title",g),T(o,"aria-label",M),T(y,"aria-label",B)},[()=>I(D.musicPlayerExpand),()=>I(D.musicPlayerHide),()=>I(D.musicPlayerHide),()=>I(D.musicPlayerExpand)]),H("click",d,function(...C){e.onInfoClick?.apply(this,C)}),H("keydown",d,C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),e.onInfoClick?.())}),H("click",o,C=>{C.stopPropagation(),e.onHideClick?.()}),H("click",y,C=>{C.stopPropagation(),e.onExpandClick?.()}),p(i,c)},P=i=>{var c=at(),v=ee(c);ye(v,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded"});var d=b(v,2);xe(d,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},showTime:!0,size:"expanded"});var w=b(d,2),_=o=>{var z=rt(),y=f(z),q=f(y);R(q,{icon:"material-symbols:visibility-off",class:"text-lg"}),m(y);var C=b(y,2);let g;var M=f(C);R(M,{icon:"material-symbols:queue-music",class:"text-lg"}),m(C),m(z),V((B,ue,ce,de)=>{T(y,"title",B),T(y,"aria-label",ue),g=K(C,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,g,{"text-[var(--primary)]":r()}),T(C,"title",ce),T(C,"aria-label",de)},[()=>I(D.musicPlayerHide),()=>I(D.musicPlayerHide),()=>I(D.musicPlayerPlaylist),()=>I(D.musicPlayerPlaylist)]),H("click",y,function(...B){e.onHideClick?.apply(this,B)}),H("click",C,function(...B){e.onPlaylistClick?.apply(this,B)}),p(o,z)};A(w,o=>{u()&&o(_)}),p(i,c)};A(h,i=>{t()==="mini"?i(s):i(P,-1)}),m(a),V(()=>K(a,1,qe(t()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),p(l,a),G()}Q(["click","keydown"]);var lt=S("<div><!></div>");function st(l,e){var t=lt();let u;var r=f(t);Me(r,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",get onCoverClick(){return e.onCoverClick},get onInfoClick(){return e.onInfoClick},get onHideClick(){return e.onHideClick},get onExpandClick(){return e.onExpandClick}}),m(t),V(()=>u=K(t,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-[17.5rem] svelte-g9ac72",null,u,{"mini-enter":!e.isHidden,"mini-leave":e.isHidden,"pointer-events-none":e.isHidden})),p(l,t)}var we=S("<button><!></button>");function _e(l,e){Y(e,!0);const t=te(e,"repeatMode",3,0),u=te(e,"disabled",3,!1);var r=ae(),a=ee(r),h=P=>{var i=we();let c;var v=f(i);R(v,{icon:"material-symbols:shuffle",class:"text-lg"}),m(i),V(d=>{c=K(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive}),i.disabled=u(),T(i,"aria-label",d)},[()=>I(D.musicPlayerShuffle)]),H("click",i,function(...d){e.onclick?.apply(this,d)}),p(P,i)},s=P=>{var i=we();let c;var v=f(i),d=o=>{R(o,{icon:"material-symbols:repeat-one",class:"text-lg"})},w=o=>{R(o,{icon:"material-symbols:repeat",class:"text-lg"})},_=o=>{R(o,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};A(v,o=>{t()===1?o(d):t()===2?o(w,1):o(_,-1)}),m(i),V(o=>{c=K(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive}),T(i,"aria-label",o)},[()=>t()===1?I(D.musicPlayerRepeatOne):I(D.musicPlayerRepeat)]),H("click",i,function(...o){e.onclick?.apply(this,o)}),p(P,i)};A(a,P=>{e.mode==="shuffle"?P(h):P(s,-1)}),p(l,r),G()}Q(["click"]);var ut=S('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function ct(l,e){var t=ut(),u=f(t);_e(u,{mode:"shuffle",get isActive(){return e.isShuffled},get onclick(){return e.onShuffleClick}});var r=b(u,2);Oe(r,{get onclick(){return e.onPrevClick},disabled:!1});var a=b(r,2);Ne(a,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get onclick(){return e.onPlayClick}});var h=b(a,2);Xe(h,{get onclick(){return e.onNextClick},disabled:!1});var s=b(h,2);{let P=ie(()=>e.isRepeating>0);_e(s,{mode:"repeat",get isActive(){return n(P)},get repeatMode(){return e.isRepeating},get onclick(){return e.onRepeatClick}})}m(t),p(l,t)}var dt=S('<div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"></div></div>');function gt(l,e){Y(e,!0);var t=dt(),u=N(t);V(r=>{T(t,"aria-label",r),T(t,"aria-valuenow",e.duration>0?e.currentTime/e.duration*100:0),Se(u,`width: ${e.duration>0?e.currentTime/e.duration*100:0}%`)},[()=>I(D.musicPlayerProgress)]),H("click",t,function(...r){e.onclick?.apply(this,r)}),H("keydown",t,function(...r){e.onkeydown?.apply(this,r)}),p(l,t),G()}Q(["click","keydown"]);var mt=S('<div class="progress-section mb-4"><!></div>');function vt(l,e){var t=mt(),u=f(t);gt(u,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onclick(){return e.onProgressClick},get onkeydown(){return e.onProgressKeyDown}}),m(t),p(l,t)}var ft=S('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function yt(l,e){Y(e,!0);var t=ft(),u=f(t),r=s=>{R(s,{icon:"material-symbols:volume-off",class:"text-lg"})},a=s=>{R(s,{icon:"material-symbols:volume-down",class:"text-lg"})},h=s=>{R(s,{icon:"material-symbols:volume-up",class:"text-lg"})};A(u,s=>{e.isMuted||e.volume===0?s(r):e.volume<.5?s(a,1):s(h,-1)}),m(t),V(s=>T(t,"aria-label",s),[()=>I(D.musicPlayerVolume)]),H("click",t,function(...s){e.onclick?.apply(this,s)}),p(l,t),G()}Q(["click"]);var bt=S('<div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function ht(l,e){var t=bt(),u=f(t);let r;m(t),Be(t,a=>e.volumeBarRef?.(a)),V(()=>{T(t,"aria-label",e.ariaLabel),T(t,"aria-valuenow",e.volume*100),r=K(u,1,"h-full bg-[var(--primary)] rounded-full transition-all",null,r,{"duration-100":!e.isVolumeDragging,"duration-0":e.isVolumeDragging}),Se(u,`width: ${e.volume*100}%`)}),H("pointerdown",t,function(...a){e.onpointerdown?.apply(this,a)}),H("keydown",t,function(...a){e.onkeydown?.apply(this,a)}),p(l,t)}Q(["pointerdown","keydown"]);var xt=S('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function wt(l,e){var t=xt(),u=f(t);yt(u,{get volume(){return e.volume},get isMuted(){return e.isMuted},get onclick(){return e.onVolumeButtonClick}});var r=b(u,2);{let h=ie(()=>e.isMuted?0:e.volume);ht(r,{get volume(){return n(h)},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onpointerdown(){return e.onSliderPointerDown},get onkeydown(){return e.onSliderKeyDown},get ariaLabel(){return e.ariaLabel}})}var a=b(r,2);Ve(a,()=>e.children??Fe),m(t),p(l,t)}var _t=S('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),kt=S("<div><!> <!> <!> <!></div>");function pt(l,e){Y(e,!0);var t=kt();let u;var r=f(t);Me(r,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return e.showPlaylist},get onHideClick(){return e.onHideClick},get onPlaylistClick(){return e.onPlaylistClick}});var a=b(r,2);vt(a,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onProgressClick(){return e.onProgressClick},get onProgressKeyDown(){return e.onProgressKeyDown}});var h=b(a,2);ct(h,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get isShuffled(){return e.isShuffled},get isRepeating(){return e.isRepeating},get canSkip(){return e.canSkip},get onPlayClick(){return e.onPlayClick},get onPrevClick(){return e.onPrevClick},get onNextClick(){return e.onNextClick},get onShuffleClick(){return e.onShuffleClick},get onRepeatClick(){return e.onRepeatClick}});var s=b(h,2);{let P=ie(()=>I(D.musicPlayerVolume));wt(s,{get volume(){return e.volume},get isMuted(){return e.isMuted},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onVolumeButtonClick(){return e.onVolumeButtonClick},get onSliderPointerDown(){return e.onSliderPointerDown},get onSliderKeyDown(){return e.onSliderKeyDown},get ariaLabel(){return n(P)},children:(i,c)=>{var v=_t(),d=f(v);R(d,{icon:"material-symbols:expand-more",class:"text-lg"}),m(v),V((w,_)=>{T(v,"title",w),T(v,"aria-label",_)},[()=>I(D.musicPlayerCollapse),()=>I(D.musicPlayerCollapse)]),H("click",v,function(...w){e.onCollapseClick?.apply(this,w)}),p(i,v)},$$slots:{default:!0}})}m(t),V(()=>u=K(t,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,u,{"opacity-0":e.isHidden,"scale-95":e.isHidden,"pointer-events-none":e.isHidden})),p(l,t),G()}Q(["click"]);var Pt=S('<span class="text-sm text-[var(--content-meta)]"> </span>'),Ct=S('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function St(l,e){Y(e,!0);const t=te(e,"lazy",3,!0);function u(g){return g.startsWith("http://")||g.startsWith("https://")||g.startsWith("/")?g:`/${g}`}var r=Ct();let a;var h=f(r),s=f(h),P=g=>{R(g,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},i=g=>{R(g,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},c=g=>{var M=Pt(),B=N(M,!0);V(()=>O(B,e.index+1)),p(g,M)};A(s,g=>{e.isCurrent&&e.isPlaying?g(P):e.isCurrent?g(i,1):g(c,-1)}),m(h);var v=b(h,2),d=N(v),w=b(v,2),_=f(w);let o;var z=N(_,!0),y=b(_,2);let q;var C=N(y,!0);m(w),m(r),V(g=>{a=K(r,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,a,{"bg-[var(--btn-plain-bg)]":e.isCurrent,"text-[var(--primary)]":e.isCurrent}),T(r,"aria-label",`播放 ${e.song.title??""} - ${e.song.artist??""}`),T(d,"src",g),T(d,"alt",e.song.title),T(d,"loading",t()?"lazy":"eager"),o=K(_,1,"font-medium truncate",null,o,{"text-[var(--primary)]":e.isCurrent,"text-90":!e.isCurrent}),O(z,e.song.title),q=K(y,1,"text-sm text-[var(--content-meta)] truncate",null,q,{"text-[var(--primary)]":e.isCurrent}),O(C,e.song.artist)},[()=>u(e.song.cover)]),H("click",r,function(...g){e.onclick?.apply(this,g)}),H("keydown",r,g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),e.onclick())}),p(l,r),G()}Q(["click","keydown"]);var Tt=S('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Mt(l,e){Y(e,!0);var t=ae(),u=ee(t),r=a=>{var h=Tt(),s=f(h),P=f(s),i=N(P,!0),c=b(P,2),v=f(c);R(v,{icon:"material-symbols:close",class:"text-lg"}),m(c),m(s);var d=b(s,2);Ae(d,21,()=>e.playlist,Re,(w,_,o)=>{{let z=ie(()=>o===e.currentIndex);St(w,{get song(){return n(_)},index:o,get isCurrent(){return n(z)},get isPlaying(){return e.isPlaying},onclick:()=>e.onPlaySong(o),lazy:o!==0})}}),m(d),m(h),V((w,_)=>{O(i,w),T(c,"aria-label",_)},[()=>I(D.musicPlayerPlaylist),()=>I(D.announcementClose)]),H("click",c,function(...w){e.onClose?.apply(this,w)}),Ce(3,h,()=>Qe,()=>({duration:300,axis:"y"})),p(a,h)};A(u,a=>{e.show&&a(r)}),p(l,t),G()}Q(["click"]);var Lt=S('<div class="fixed bottom-20 right-4 z-[60] max-w-sm" role="alert" aria-live="assertive"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button type="button" class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),Et=S('<div class="music-player-fab-anchor fixed z-[55]"><div class="music-player-fab-shell"><!></div></div>'),zt=S("<div><div><!></div> <!> <!> <!></div>"),Dt=S(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (max-width: 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (max-width: 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function Nt(l,e){Y(e,!0);let t=ve(pe(k.getState()));const u=me.showFloatingPlayer,r=(me.floatingEntryMode??"default")==="fab",a=u&&me.enable,h=I(D.announcementClose);let s;function P(){k.toggle()}function i(){k.prev()}function c(){k.next()}function v(){k.toggleShuffle()}function d(){k.toggleRepeat()}function w(x){k.playIndex(x)}function _(x){const L=x.currentTarget;if(!L)return;const J=L.getBoundingClientRect(),U=(x.clientX-J.left)/J.width;k.setProgress(U)}function o(x){(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),k.setProgress(.5))}function z(){k.toggleMute()}function y(){k.toggleMute()}function q(x){const L=x.currentTarget;if(!L)return;const J=E=>{const X=L.getBoundingClientRect();if(X.width<=0)return;const j=Math.max(0,Math.min(1,(E-X.left)/X.width));k.setVolume(j)};J(x.clientX);const U=x.pointerId;L.setPointerCapture(U);const oe=E=>{E.pointerId===U&&J(E.clientX)},le=()=>{L.removeEventListener("pointermove",oe),L.removeEventListener("pointerup",se),L.removeEventListener("pointercancel",F),L.hasPointerCapture(U)&&L.releasePointerCapture(U)},se=E=>{E.pointerId===U&&(J(E.clientX),le())},F=E=>{E.pointerId===U&&le()};L.addEventListener("pointermove",oe),L.addEventListener("pointerup",se),L.addEventListener("pointercancel",F)}function C(x){const L=x.target;if(!(L?.tagName==="INPUT"||L?.tagName==="TEXTAREA"||L?.contentEditable==="true"||L?.closest("button, a, select, option, [role='button'], [role='menuitem']"))){if(x.key==="ArrowLeft"||x.key==="ArrowDown"){x.preventDefault(),k.setVolume(n(t).volume-.05);return}if(x.key==="ArrowRight"||x.key==="ArrowUp"){x.preventDefault(),k.setVolume(n(t).volume+.05);return}(x.key==="Enter"||x.key===" "||x.key==="m"||x.key==="M")&&(x.preventDefault(),z())}}function g(){k.togglePlaylist()}function M(){k.toggleExpanded()}function B(){k.toggleHidden()}function ue(){k.hideError()}function ce(x){}function de(){return k.canSkip()}ke(()=>{s=k.subscribe(x=>{fe(t,x,!0)}),k.initialize()}),Pe(()=>{s&&s(),k.destroy()});var be=ae();Ie("keydown",He,C);var Le=ee(be),Ee=x=>{var L=Dt(),J=ee(L),U=F=>{var E=Lt(),X=f(E),j=f(X);R(j,{icon:"material-symbols:error",class:"text-xl flex-shrink-0"});var Z=b(j,2),$=N(Z,!0),W=b(Z,2),re=f(W);R(re,{icon:"material-symbols:close",class:"text-lg"}),m(W),m(X),m(E),V(()=>{O($,n(t).errorMessage),T(W,"aria-label",h)}),H("click",W,ue),p(F,E)};A(J,F=>{n(t).showError&&F(U)});var oe=b(J,2),le=F=>{var E=ae(),X=ee(E),j=Z=>{var $=Et(),W=f($),re=f(W);$e(re,{}),m(W),m($),Ce(3,W,()=>Je,()=>({y:16,duration:280,opacity:.12,easing:Ge})),p(Z,$)};A(X,Z=>{n(t).isExpanded&&Z(j)}),p(F,E)},se=F=>{var E=zt();let X;var j=f(E),Z=f(j);ye(Z,{get cover(){return n(t).currentSong.cover},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},size:"orb",onclick:B}),m(j);var $=b(j,2);{let ge=ie(()=>n(t).isExpanded||n(t).isHidden);st($,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isHidden(){return n(ge)},onCoverClick:P,onInfoClick:M,onHideClick:B,onExpandClick:M})}var W=b($,2);{let ge=ie(de),ze=ie(()=>!n(t).isExpanded);pt(W,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isShuffled(){return n(t).isShuffled},get isRepeating(){return n(t).isRepeating},get showPlaylist(){return n(t).showPlaylist},get canSkip(){return n(ge)},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},isVolumeDragging:!1,get isHidden(){return n(ze)},volumeBarRef:ce,onPlayClick:P,onPrevClick:i,onNextClick:()=>c(),onShuffleClick:v,onRepeatClick:d,onProgressClick:_,onProgressKeyDown:o,onVolumeButtonClick:y,onSliderPointerDown:q,onSliderKeyDown:C,onHideClick:B,onPlaylistClick:g,onCollapseClick:M})}var re=b(W,2);Mt(re,{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(t).showPlaylist},onClose:g,onPlaySong:w}),m(E),V(()=>{X=K(E,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,X,{expanded:n(t).isExpanded,"hidden-mode":n(t).isHidden}),K(j,1,`orb-player-container ${n(t).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),p(F,E)};A(oe,F=>{r?F(le):F(se,-1)}),De(2),p(x,L)};A(Le,x=>{a&&x(Ee)}),p(l,be),G()}Q(["click"]);export{Nt as default};
