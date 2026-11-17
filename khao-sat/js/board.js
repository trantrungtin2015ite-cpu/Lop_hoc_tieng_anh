import {S} from "./i18n.js";
import {speakEn} from "./voice.js";
/* ---------------- board engine ---------------- */
export function makeBoard(svg,P,onEv){
 var NS="http://www.w3.org/2000/svg",W=380,H=256;
 var SX=function(x){return 30+(x-P.xr[0])/(P.xr[1]-P.xr[0])*320;},SY=function(y){return 190-(y-P.yr[0])/(P.yr[1]-P.yr[0])*168;};
 svg.innerHTML="";
 function el(tg,a,p){var e=document.createElementNS(NS,tg);for(var k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e;}
 if(P.xr[0]<0&&P.xr[1]>0)el("line",{x1:SX(0),y1:16,x2:SX(0),y2:196,stroke:"var(--axis)","stroke-width":1});
 if(P.yr[0]<0&&P.yr[1]>0)el("line",{x1:18,y1:SY(0),x2:362,y2:SY(0),stroke:"var(--axis)","stroke-width":1});
 P.lines.forEach(function(L){if(L.v==="v")el("line",{x1:SX(L.at),y1:16,x2:SX(L.at),y2:196,stroke:"var(--muted)","stroke-width":1.5,"stroke-dasharray":"6 5"});
   else el("line",{x1:18,y1:SY(L.at),x2:362,y2:SY(L.at),stroke:"var(--muted)","stroke-width":1.5,"stroke-dasharray":"6 5"});});
 function pathD(br,a,b){var f=P.fn[br].f,d="",n=Math.max(4,Math.ceil((b-a)*24));for(var k=0;k<=n;k++){var x=a+(b-a)*k/n;d+=(k?"L":"M")+SX(x).toFixed(1)+" "+SY(f(x)).toFixed(1);}return d;}
 P.fn.forEach(function(F,i){el("path",{d:pathD(i,F.a,F.b),fill:"none",stroke:"var(--curve)","stroke-width":3,"stroke-linecap":"round"});});
 P.points.forEach(function(p){el("circle",{cx:SX(p.x),cy:SY(p.y),r:4.5,fill:"var(--curve)"});});
 var hl=el("g",{}),lb=el("g",{}),pulse=el("g",{});
 var hand=el("circle",{r:11,fill:"var(--hand)","fill-opacity":0.25,stroke:"var(--hand)","stroke-width":2,cx:-30,cy:-30});
 el("line",{x1:12,y1:204,x2:368,y2:204,stroke:"var(--line)","stroke-width":1});
 var tray=el("g",{}),drag=el("g",{});
 var SAMP=P.fn.map(function(F){var a=[];for(var k=0;k<=220;k++){var x=F.a+(F.b-F.a)*k/220;a.push([x,SX(x),SY(F.f(x))]);}return a;});
 function nearestOn(br,p,a,b){var best=null,m=1e9;SAMP[br].forEach(function(s){if(a!=null&&(s[0]<a||s[0]>b))return;var dx=s[1]-p[0],dy=s[2]-p[1],d=dx*dx+dy*dy;if(d<m){m=d;best=s;}});return best?{br:br,x:best[0],d:Math.sqrt(m)}:{br:br,x:0,d:1e9};}
 function nearestAll(p){var b=null;P.fn.forEach(function(F,i){var n=nearestOn(i,p);if(!b||n.d<b.d)b=n;});return b;}
 function regionOf(br,x){for(var i=0;i<P.regions.length;i++){var r=P.regions[i];if(r.br===br&&x>=r.a-1e-9&&x<=r.b+1e-9)return i;}return -1;}
 function ang(br,x){var f=P.fn[br].f,h=0.01,dx=SX(x+h)-SX(x-h),dy=SY(f(x+h))-SY(f(x-h)),a=Math.atan2(dy,dx)*180/Math.PI;if(a>90)a-=180;if(a<-90)a+=180;return a;}
 function cw(w){return w.length*7.8+22;}
 function chip(w,c,cx,cy,a,par){var g=el("g",{transform:"translate("+cx.toFixed(1)+","+cy.toFixed(1)+") rotate("+(a||0).toFixed(1)+")"},par);var wd=cw(w);
  el("rect",{x:-wd/2,y:-14,width:wd,height:28,rx:14,fill:c,"fill-opacity":0.14,stroke:c,"stroke-width":1.5},g);
  var tx=el("text",{x:0,y:1,"text-anchor":"middle","dominant-baseline":"central","font-size":14,"font-weight":600,fill:c,"font-family":"Be Vietnam Pro, sans-serif"},g);tx.textContent=w;return g;}
 function clampPose(s,w){var hw=cw(w)/2;s.cx=Math.max(hw+4,Math.min(376-hw,s.cx));s.cy=Math.max(18,Math.min(188,s.cy));return s;}
 function tdist(tg,p){
  if(tg.k==="region"){var r=P.regions[tg.i];return nearestOn(r.br,p,r.a,r.b).d;}
  if(tg.k==="point"){var q=P.points[tg.i];return Math.hypot(SX(q.x)-p[0],SY(q.y)-p[1]);}
  var L=P.lines[tg.i];return L.v==="v"?Math.abs(SX(L.at)-p[0]):Math.abs(SY(L.at)-p[1]);}
 function pose(tg,p,w,side){
  if(tg.k==="region"){var r=P.regions[tg.i],n=nearestOn(r.br,p,r.a,r.b),cx=SX(n.x),cy=SY(P.fn[r.br].f(n.x)),a=ang(r.br,n.x),ra=a*Math.PI/180,nx=-Math.sin(ra),ny=Math.cos(ra);
   var s=side||((p[0]-cx)*nx+(p[1]-cy)*ny>0?1:-1);return clampPose({cx:cx+nx*s*22,cy:cy+ny*s*22,ang:a},w);}
  if(tg.k==="point"){var q=P.points[tg.i];return clampPose({cx:SX(q.x),cy:SY(q.y)+q.side*26,ang:0},w);}
  var L=P.lines[tg.i];
  if(L.v==="v"){var sv=side||(p[0]>=SX(L.at)?1:-1);return clampPose({cx:SX(L.at)+sv*(cw(w)/2+10),cy:p[1],ang:0},w);}
  var sh=side||(p[1]>=SY(L.at)?1:-1);return clampPose({cx:p[0],cy:SY(L.at)+sh*22,ang:0},w);}
 function nearestTarget(p){var b=null,bd=1e9;P.targets.forEach(function(tg){var d=tdist(tg,p);if(d<bd){bd=d;b=tg;}});return {tg:b,d:bd};}
 function tname(tg){return tg.k==="region"?P.regions[tg.i][S.lang]:tg.k==="point"?P.points[tg.i][S.lang]:P.lines[tg.i][S.lang];}
 var TRX=[95,285];
 P.chips.forEach(function(c,i){chip(c.w,c.c,TRX[i],230,0,tray);});
 function newTrace(){var g=el("g",{},hl);return P.regions.map(function(r){return el("path",{fill:"none",stroke:r.dir==="up"?"var(--up)":"var(--down)","stroke-width":7,"stroke-linecap":"round","stroke-opacity":0.8},g);});}
 function paint(ps,br,a,b){var cov=[];P.regions.forEach(function(r,i){if(r.br!==br){return;}var lo=Math.max(a,r.a),hi=Math.min(b,r.b);if(hi>lo){ps[i].setAttribute("d",pathD(br,lo,hi));cov.push([i,(hi-lo)/(r.b-r.a)]);}else ps[i].setAttribute("d","");});return cov;}
 function ring(x,y){var c=el("circle",{cx:x,cy:y,r:8,fill:"none",stroke:"var(--hand)","stroke-width":2.5},pulse);var t0=null;
  function st(ts){if(!t0)t0=ts;var k=(ts-t0)/600;c.setAttribute("r",(8+14*k).toFixed(1));c.setAttribute("stroke-opacity",(1-k).toFixed(2));if(k<1)requestAnimationFrame(st);else pulse.removeChild(c);}requestAnimationFrame(st);}
 function pos(e){var pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;var m=svg.getScreenCTM();if(m){var q=pt.matrixTransform(m.inverse());return [q.x,q.y];}var r=svg.getBoundingClientRect();return [(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height];}
 var placed=[],mode=null,start=0,end=0,tbr=0,ps=null,dg=null,busy=false;
 function place(w,c,s,tg){var g=chip(w,c,s.cx,s.cy,s.ang,lb);placed.push({g:g,w:w,c:c,s:s,tg:tg});}
 function hitLabel(p){for(var k=placed.length-1;k>=0;k--){var L=placed[k],a=-L.s.ang*Math.PI/180,dx=p[0]-L.s.cx,dy=p[1]-L.s.cy,lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);if(Math.abs(lx)<cw(L.w)/2+8&&Math.abs(ly)<24)return k;}return -1;}
 function goBack(d,x0,y0,a0){var to=d.from.s,t0=null;busy=true;
  function st(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/320),e=1-Math.pow(1-k,3);
   d.g.setAttribute("transform","translate("+(x0+(to.cx-x0)*e).toFixed(1)+","+(y0+(to.cy-y0)*e).toFixed(1)+") rotate("+(a0+(to.ang-a0)*e).toFixed(1)+")");
   if(k<1)requestAnimationFrame(st);else{drag.innerHTML="";busy=false;if(d.from.placed)place(d.w,d.c,to,d.from.tg);}}requestAnimationFrame(st);}
 function down(e){if(busy)return;var p=pos(e);if(e.cancelable)e.preventDefault();try{svg.setPointerCapture(e.pointerId);}catch(x){}
  var k=hitLabel(p);
  if(k>=0){var L=placed.splice(k,1)[0];lb.removeChild(L.g);mode="drag";drag.innerHTML="";dg={w:L.w,c:L.c,s:L.s,tg:L.tg,from:{s:L.s,placed:true,tg:L.tg},g:chip(L.w,L.c,L.s.cx,L.s.cy,L.s.ang,drag)};onEv({type:"pick"});return;}
  if(p[1]>204){P.chips.forEach(function(c,i){if(Math.abs(p[0]-TRX[i])<cw(c.w)/2+6){mode="drag";drag.innerHTML="";dg={w:c.w,c:c.c,from:{s:{cx:TRX[i],cy:230,ang:0},placed:false},g:chip(c.w,c.c,p[0],p[1],0,drag)};}});return;}
  var n=nearestAll(p);
  if(n.d<44){mode="trace";tbr=n.br;start=end=n.x;ps=newTrace();hand.setAttribute("cx",SX(n.x));hand.setAttribute("cy",SY(P.fn[tbr].f(n.x)));onEv({type:"tracing"});return;}
  var nt=nearestTarget(p);
  if(nt.tg&&nt.tg.k!=="region"&&nt.d<30){ring(p[0],p[1]);onEv({type:"tap",name:tname(nt.tg)});return;}
  onEv({type:"miss"});}
 function move(e){if(!mode)return;if(e.cancelable)e.preventDefault();var p=pos(e);
  if(mode==="drag"){var nt=nearestTarget(p);
   if(p[1]<200&&nt.d<60){var s=pose(nt.tg,p,dg.w);dg.g.setAttribute("transform","translate("+s.cx.toFixed(1)+","+s.cy.toFixed(1)+") rotate("+s.ang.toFixed(1)+")");dg.s=s;dg.tg=nt.tg;}
   else{dg.g.setAttribute("transform","translate("+p[0].toFixed(1)+","+p[1].toFixed(1)+")");dg.s=null;dg.tg=null;}return;}
  var n=nearestOn(tbr,p);end=n.x;var F=P.fn[tbr];paint(ps,tbr,Math.min(start,end),Math.max(start,end));
  hand.setAttribute("cx",SX(end));hand.setAttribute("cy",SY(F.f(end)));var ri=regionOf(tbr,end);if(ri>=0)onEv({type:"over",name:P.regions[ri][S.lang],dir:P.regions[ri].dir});}
 function up(e){if(!mode)return;var p=pos(e);
  if(mode==="drag"){var d=dg,s=d.s;mode=null;
   if(p[1]>200){drag.innerHTML="";onEv({type:"remove",word:d.w});return;}
   if(!s){onEv({type:"far"});goBack(d,p[0],p[1],0);return;}
   if(d.tg.w!==d.w){onEv({type:"wrong",word:d.w,name:tname(d.tg)});goBack(d,s.cx,s.cy,s.ang);return;}
   drag.innerHTML="";place(d.w,d.c,s,d.tg);onEv({type:"label",word:d.w,name:tname(d.tg)});return;}
  mode=null;hand.setAttribute("cx",-30);var a=Math.min(start,end),b=Math.max(start,end);
  if(b-a<(P.fn[tbr].b-P.fn[tbr].a)*0.04){hl.removeChild(ps[0].parentNode);
   var x=start,nt=nearestTarget([SX(x),SY(P.fn[tbr].f(x))]);
   if(nt.tg&&nt.tg.k==="point"&&nt.d<30){ring(SX(x),SY(P.fn[tbr].f(x)));onEv({type:"tap",name:tname(nt.tg)});}else onEv({type:"short"});return;}
  var cov=paint(ps,tbr,a,b).filter(function(c){return c[1]>0.15;});
  onEv({type:"trace",parts:cov.map(function(c){return P.regions[c[0]];})});}
 svg.addEventListener("pointerdown",down);svg.addEventListener("pointermove",move);svg.addEventListener("pointerup",up);svg.addEventListener("pointercancel",up);
 ["touchstart","touchmove"].forEach(function(ty){svg.addEventListener(ty,function(e){if(e.cancelable)e.preventDefault();},{passive:false});});
 function clear(){hl.innerHTML="";lb.innerHTML="";drag.innerHTML="";placed=[];hand.setAttribute("cx",-30);}
 function demo(done){clear();busy=true;var items=P.demo,s0=null,stage=-1;
  function step(ts){if(!s0)s0=ts;var t=(ts-s0)/1000,i=Math.min(1,Math.floor(t/2.5)),lt=t-i*2.5,it=items[i];
   if(i!==stage){stage=i;speakEn(it.w);onEv({type:"demo",word:it.w});}
   var chipC=P.chips.filter(function(c){return c.w===it.w;})[0].c;
   if(it.k==="region"){var r=P.regions[it.i],k=Math.min(1,Math.max(0,(lt-0.2)/1.5)),x=r.a+(r.b-r.a)*k,f=P.fn[r.br].f;
    if(!it._p){it._p=el("path",{fill:"none",stroke:r.dir==="up"?"var(--up)":"var(--down)","stroke-width":7,"stroke-linecap":"round","stroke-opacity":0.8},hl);}
    if(k>0)it._p.setAttribute("d",pathD(r.br,r.a,Math.max(r.a+0.001,x)));hand.setAttribute("cx",SX(x));hand.setAttribute("cy",SY(f(x)));
    if(lt>1.9&&!it._l){it._l=1;var mid=(r.a+r.b)/2;place(it.w,chipC,pose({k:"region",i:it.i},[SX(mid),SY(f(mid))],it.w,it.side||-1),null);}}
   else if(it.k==="point"){var q=P.points[it.i],qx=SX(q.x),qy=SY(q.y),k2=Math.min(1,lt/0.8);hand.setAttribute("cx",(qx+40*(1-k2)).toFixed(1));hand.setAttribute("cy",(qy+30*(1-k2)).toFixed(1));
    if(lt>0.9&&!it._r){it._r=1;ring(qx,qy);}if(lt>1.6&&!it._l){it._l=1;place(it.w,chipC,pose({k:"point",i:it.i},[qx,qy],it.w),null);}}
   else{var L=P.lines[it.i],k3=Math.min(1,Math.max(0,(lt-0.2)/1.4));
    if(L.v==="v"){hand.setAttribute("cx",SX(L.at));hand.setAttribute("cy",(30+150*k3).toFixed(1));}else{hand.setAttribute("cx",(30+320*k3).toFixed(1));hand.setAttribute("cy",SY(L.at));}
    if(lt>1.8&&!it._l){it._l=1;var pp=L.v==="v"?[SX(L.at)+20,70]:[300,SY(L.at)-20];place(it.w,chipC,pose({k:"line",i:it.i},pp,it.w),null);}}
   if(t<5)requestAnimationFrame(step);else{hand.setAttribute("cx",-30);busy=false;items.forEach(function(x){delete x._p;delete x._l;delete x._r;});done&&done();}}
  requestAnimationFrame(step);}
 return {clear:clear,demo:demo};
}

export function boardCaption(ev,P){var L=S.lang==="vi";
 switch(ev.type){
  case "tracing":return L?"Đang lướt theo đồ thị…":"Tracing the graph…";
  case "over":return (L?"Đang lướt trên ":"Tracing the ")+ev.name+" ("+(ev.dir==="up"?"increasing":"decreasing")+")";
  case "trace":return ev.parts.length?(L?"Đã lướt ":"Traced the ")+ev.parts.map(function(r){return r[S.lang]+" ("+(r.dir==="up"?"increasing":"decreasing")+")";}).join(L?" rồi ":" then "):(L?"Thử lướt dài hơn":"Try a longer trace");
  case "tap":return (L?"Đã chỉ vào ":"Pointed at the ")+ev.name;
  case "short":return L?"Nét quá ngắn, thử lướt dài hơn":"Too short, try a longer trace";
  case "miss":return L?"Đặt ngón tay gần đường cong rồi lướt theo nó":"Put your finger near the curve, then trace it";
  case "pick":return L?"Đang di chuyển nhãn. Kéo về khay để gỡ bỏ":"Moving the label. Drag it to the tray to remove it";
  case "remove":return (L?"Đã gỡ nhãn ":"Removed ")+ev.word;
  case "far":return L?"Kéo nhãn đến gần đúng chỗ rồi thả":"Drag the label close to its place, then let go";
  case "wrong":return L?"Chưa đúng: "+ev.name+" không phải "+ev.word+", nhãn quay về chỗ cũ":"Not quite: the "+ev.name+" is not "+ev.word+", the label goes back";
  case "label":return L?"Đúng rồi: "+ev.name+" là "+ev.word:"Right: the "+ev.name+" is "+ev.word;
  case "demo":return (L?"Mô phỏng: ":"Demo: ")+ev.word;
 }return "";}

