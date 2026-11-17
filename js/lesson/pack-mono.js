// Graph pack for y = x^3 - 3x (from the survey), reused on the warm-up slide.
export const MONO = {id:"mono",vi:"Tính đơn điệu của hàm số",en:"Monotonicity of functions",grade:"Lớp 12",
  xr:[-2.4,2.4],yr:[-3.4,3.4],fn:[{f:function(x){return x*x*x-3*x;},a:-2.1,b:2.1}],
  regions:[{br:0,a:-2.1,b:-1,dir:"up",vi:"đoạn đi lên bên trái",en:"left rising part"},{br:0,a:-1,b:1,dir:"down",vi:"đoạn đi xuống ở giữa",en:"middle falling part"},{br:0,a:1,b:2.1,dir:"up",vi:"đoạn đi lên bên phải",en:"right rising part"}],
  points:[],lines:[],
  chips:[{w:"increasing",c:"var(--up)"},{w:"decreasing",c:"var(--down)"}],
  targets:[{k:"region",i:0,w:"increasing"},{k:"region",i:1,w:"decreasing"},{k:"region",i:2,w:"increasing"}],
  demo:[{k:"region",i:0,w:"increasing",side:-1},{k:"region",i:1,w:"decreasing",side:1}],
  q:{vi:"Hãy chỉ cho lớp đoạn nào hàm số đồng biến.",en:"Show the class where the function is increasing."},
  guide:{vi:"Hãy dùng tay lướt theo phần đồ thị đi lên khi nói <b class='up'>đồng biến (increasing)</b>, và phần đi xuống khi nói <b class='down'>nghịch biến (decreasing)</b>. Kéo nhãn đặt lên đúng phần của nó.",
         en:"Trace the part of the graph that goes up as you say <b class='up'>increasing</b>, and the part that goes down as you say <b class='down'>decreasing</b>. Drag each label onto the right part."},
  kw:"graph · goes up · goes down · increasing · decreasing",model:"Look at the graph. Here it goes up. The function is increasing."};
