import{_ as w,B as E,i as H,l as I,u as L,c as u,a as S,k as d,F as q,e as M,C as m,D as T,j as c,w as g,n as p,r as B,q as k,o as l,p as C,d as f,t as v}from"./index-bPnPnLSG.js";import{e as X,h as A}from"./storyblok-B26zdZb7.js";const _={name:"ImageGallery",components:{ButtonBase:E},props:{name:{type:String,required:!1,default:""},slug:{type:String,required:!0},location:{type:String,required:!1,default:""},date:{type:String,required:!1,default:""},images:{type:Array,required:!0},repeatCount:{type:Number,required:!0},isActive:{type:Boolean,default:!1},imageHeight:{type:String,default:"230rem",required:!1},imageWidth:{type:String,default:"auto",required:!1},imageQuality:{type:Number,default:85,required:!1},imageFormat:{type:String,default:null,required:!1},resolutionRatio:{type:Number,default:1,required:!1,validator:e=>e>0}},data(){return{isScrolling:!1,scrollTimeout:null,scrollStartX:0,isHovering:!1}},setup(){const e=L(),i=I();return{router:e,route:i}},methods:{navigateToShow(e){this.isActive||this.isScrolling||H.navigateTo(this.router,`/shows/${this.slug}`)},handleScrollStart(e){this.isActive||(this.scrollStartX=e.touches?e.touches[0].clientX:e.clientX,this.isScrolling=!1)},handleScrollMove(e){if(this.isActive||!this.scrollStartX)return;const i=e.touches?e.touches[0].clientX:e.clientX;Math.abs(i-this.scrollStartX)>5&&(this.isScrolling=!0)},handleScrollEnd(){this.isActive||(clearTimeout(this.scrollTimeout),this.scrollTimeout=setTimeout(()=>{this.isScrolling=!1,this.scrollStartX=0},100))},customizeImageParams(e={}){let i;if(this.imageHeight.includes("vh")){const o=window.innerHeight||document.documentElement.clientHeight,s=parseFloat(this.imageHeight);i=Math.round(s/100*o)}else if(this.imageHeight.includes("rem")){const o=parseFloat(getComputedStyle(document.documentElement).fontSize);i=parseFloat(this.imageHeight)*o}else i=parseInt(this.imageHeight)||100;let t=0;this.imageWidth!=="auto"&&(t=parseInt(this.imageWidth)||0);const n=Math.round(i*this.resolutionRatio),r=t?Math.round(t*this.resolutionRatio):0,a=A({width:r,height:n,quality:this.imageQuality,resolutionRatio:this.resolutionRatio});return{width:a.width,height:a.height,quality:a.quality,format:this.imageFormat,...e}}},computed:{processedImages(){if(!this.images||!Array.isArray(this.images)||this.images.length===0)return console.warn("No images provided to ImageGallery component"),[];const e=this.images.map((t,n)=>{if(!t||!t.url)return console.warn(`Image at index ${n} has no URL:`,t),{url:"",alt:"Missing image"};const r=this.customizeImageParams();return{url:X(t.url,r),alt:t.alt||"Image"}}),i=[];for(let t=0;t<this.repeatCount;t++)i.push(...e);return i},repeatedImages(){const e=[];for(let i=0;i<this.repeatCount;i++)e.push(...this.images);return e},imageStyle(){return{height:this.imageHeight,width:this.imageWidth!=="auto"?this.imageWidth:"auto"}},galleryContainerStyle(){return{height:this.imageHeight,minHeight:this.imageHeight}},galleryItemStyle(){return this.imageWidth!=="auto"?{width:this.imageWidth}:{}},shouldShowTags(){return this.name&&this.name.trim().length>0||this.location&&this.location.trim().length>0||this.date&&this.date.trim().length>0}},mounted(){const e=this.$refs.gallery;e&&(e.addEventListener("mousedown",this.handleScrollStart),e.addEventListener("mousemove",this.handleScrollMove),e.addEventListener("mouseup",this.handleScrollEnd),e.addEventListener("mouseleave",this.handleScrollEnd),e.addEventListener("touchstart",this.handleScrollStart),e.addEventListener("touchmove",this.handleScrollMove),e.addEventListener("touchend",this.handleScrollEnd)),this.shouldShowTags&&((!this.name||this.name.trim().length===0)&&console.warn(`Empty name tag detected for gallery with slug: ${this.slug}`),(!this.location||this.location.trim().length===0)&&console.warn(`Empty location tag detected for gallery with slug: ${this.slug}`),(!this.date||this.date.trim().length===0)&&console.warn(`Empty date tag detected for gallery with slug: ${this.slug}`))},beforeUnmount(){const e=this.$refs.gallery;e&&(e.removeEventListener("mousedown",this.handleScrollStart),e.removeEventListener("mousemove",this.handleScrollMove),e.removeEventListener("mouseup",this.handleScrollEnd),e.removeEventListener("mouseleave",this.handleScrollEnd),e.removeEventListener("touchstart",this.handleScrollStart),e.removeEventListener("touchmove",this.handleScrollMove),e.removeEventListener("touchend",this.handleScrollEnd)),clearTimeout(this.scrollTimeout)}},b=["alt","data-index"];function W(e,i,t,n,r,a){const h=B("ButtonBase"),o=k("lazy-load");return l(),u("div",{class:p(["gallery-container",{clickable:!t.isActive}])},[S("div",{class:"gallery",ref:"gallery",style:m(a.galleryContainerStyle),onClick:i[0]||(i[0]=(...s)=>a.navigateToShow&&a.navigateToShow(...s)),onMouseenter:i[1]||(i[1]=s=>r.isHovering=!t.isActive),onMouseleave:i[2]||(i[2]=s=>r.isHovering=!1)},[(l(!0),u(q,null,M(a.processedImages,(s,y)=>(l(),u("div",{key:y,class:"gallery-item",style:m(a.galleryItemStyle)},[C(S("img",{alt:s.alt,style:m(a.imageStyle),"data-index":y,class:"gallery-image"},null,12,b),[[o,{url:s.url,threshold:.1,rootMargin:"100px"}]])],4))),128))],36),a.shouldShowTags?(l(),u("div",{key:0,class:"gallery-tags",onClick:i[3]||(i[3]=T(()=>{},["stop"]))},[t.name&&t.name.trim().length>0?(l(),c(h,{key:0,to:`/shows/${t.slug}`,variant:t.isActive?"active":"black",class:p({"button-hover":r.isHovering})},{default:g(()=>[f(v(t.name),1)]),_:1},8,["to","variant","class"])):d("",!0),t.location&&t.location.trim().length>0?(l(),c(h,{key:1,variant:"grey"},{default:g(()=>[f(v(t.location),1)]),_:1})):d("",!0),t.date&&t.date.trim().length>0?(l(),c(h,{key:2,variant:"grey"},{default:g(()=>[f(v(t.date),1)]),_:1})):d("",!0)])):d("",!0)],2)}const F=w(_,[["render",W]]);export{F as I};
