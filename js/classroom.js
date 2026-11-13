import {esc} from "./i18n.js";
/* ---------------- classroom picture ---------------- */
export function classroom(id){
 var h='<svg id="'+id+'" class="scene cls" viewBox="0 0 380 210" role="img" aria-label="Lớp học nhìn từ bục giảng">';
 h+='<rect x="0" y="0" width="380" height="210" fill="#e9efe6"/><rect x="0" y="150" width="380" height="60" fill="#d9d2c3"/>';
 h+='<rect x="96" y="10" width="188" height="56" rx="3" fill="#fbfbf8" stroke="#b4b2a9"/><rect x="20" y="16" width="44" height="34" rx="2" fill="#c7d9e6" stroke="#b4b2a9"/><rect x="316" y="16" width="44" height="34" rx="2" fill="#c7d9e6" stroke="#b4b2a9"/>';
 var rows=[{y:100,s:0.72,xs:[78,134,190,246,302]},{y:130,s:0.86,xs:[62,126,190,254,318]},{y:168,s:1,xs:[46,118,190,262,334]}];
 var skins=["#e8c39e","#d9ae86","#f0cfab","#c99a72","#e2b993"],hair=["#2c2c2a","#3d2b1f","#1f1f1f","#4a3426"];
 rows.forEach(function(r,ri){
  r.xs.forEach(function(x,i){var k=(ri*5+i);
   h+='<g transform="translate('+x+','+r.y+') scale('+r.s+')"><g class="stu">';
   h+='<rect x="-15" y="-6" width="30" height="28" rx="9" fill="#f7f7f4" stroke="#cfcbc0"/>';
   h+='<circle cx="0" cy="-18" r="11" fill="'+skins[k%5]+'"/>';
   h+='<path d="M-11 -19 a11 11 0 0 1 22 0 q-5 -5 -11 -4 q-6 -1 -11 4z" fill="'+hair[k%4]+'"/>';
   h+='</g></g>';});
  h+='<rect x="'+(r.xs[0]-28*r.s)+'" y="'+(r.y+8*r.s)+'" width="'+(r.xs[4]-r.xs[0]+56*r.s)+'" height="'+(14*r.s)+'" rx="3" fill="#b88d63"/>';
 });
 h+='<g class="bub"></g></svg>';
 return h;
}
export function bubbles(svg,list){var g=svg.querySelector(".bub");g.innerHTML="";
 list.forEach(function(b,i){var w=b.t.length*6.4+18,x=Math.max(4,Math.min(376-w,b.x-w/2));
  var e=document.createElementNS("http://www.w3.org/2000/svg","g");e.style.opacity="0";e.style.transition="opacity .25s ease "+(i*0.15)+"s";
  e.innerHTML='<rect x="'+x+'" y="'+b.y+'" width="'+w+'" height="22" rx="11" fill="#ffffff" stroke="#888780"/><text x="'+(x+w/2)+'" y="'+(b.y+15)+'" text-anchor="middle" font-size="12" font-family="Be Vietnam Pro, sans-serif" fill="#2c2c2a">'+esc(b.t)+'</text>';
  g.appendChild(e);requestAnimationFrame(function(){requestAnimationFrame(function(){e.style.opacity="1";});});});}
export function anim(svg,cls){svg.classList.remove("bounce","nod");void svg.getBoundingClientRect();if(cls)svg.classList.add(cls);}

