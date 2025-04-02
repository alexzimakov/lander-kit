(()=>{function p(c){let t=c.split(`
`),e=0;return t.length>0&&t.forEach(r=>{let s=r.match(/^[ \t]*(?=\S)/gm);if(s){let o=s[0].length;o>0&&(e===0||o<e)&&(e=o)}}),t.map(r=>r.slice(e)).join(`
`).trim()}function g(c,...t){let e=c.raw,r="";return t.forEach((s,o)=>{let i=e[o];s==null?s="":Array.isArray(s)?s=s.join(""):typeof s=="object"?s=JSON.stringify(s):s=String(s),i.endsWith("!")&&(s=w(s),i=i.slice(0,-1)),r+=i,r+=s}),r+=e[e.length-1],p(r)}function w(c){return c.replace(/&/g,"&amp;").replace(/>/g,"&gt;").replace(/</g,"&lt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/`/g,"&#96;")}function d(c,t){customElements.get(c)===void 0&&customElements.define(c,t)}var k=":host{--value-color:inherit;--track-color:#e5e7eb;--progress-color:#111827;justify-content:center;align-items:center;display:inline-flex;position:relative}.track{stroke:var(--track-color)}.progress{stroke:var(--progress-color);transform-origin:50%;transform:rotate(-90deg)}.value{width:100%;height:100%;color:var(--value-color);justify-content:center;align-items:center;line-height:1;display:flex;position:absolute;top:0;left:0}";var h=class extends HTMLElement{static get observedAttributes(){return["value","rounded","size","track-width","track-color","progress-color"]}constructor(){super(),this._frameId=-1,this.render()}get value(){let t=Number(this.getAttribute("value"));return!Number.isFinite(t)||t<0?0:t>100?100:t}set value(t){Number.isFinite(t)&&t>=0&&t<=100&&this.setAttribute("value",String(t))}get size(){let t=this.getAttribute("size");if(t){let e=Number(t);if(Number.isFinite(e)&&e>=0)return e}return 64}set size(t){Number.isFinite(t)&&t>=0&&this.setAttribute("size",String(t))}get trackWidth(){let t=this.getAttribute("track-width");if(t){let e=Number(t);if(Number.isFinite(e)&&e>=0)return e}return 4}set trackWidth(t){Number.isFinite(t)&&t>=0&&this.setAttribute("track-width",String(t))}get trackColor(){return this.getAttribute("track-color")||""}set trackColor(t){this.setAttribute("track-color",t)}get progressColor(){return this.getAttribute("progress-color")||""}set progressColor(t){this.setAttribute("progress-color",t)}get isRounded(){let t=this.getAttribute("rounded");return t!=null&&t!=="false"}set isRounded(t){t?this.setAttribute("rounded",""):this.removeAttribute("rounded")}calcParams(t){let e=this.size,r=this.trackWidth,s=e/2-r,o=e/2,i=2*Math.PI*s,n=i*((100-t)/100);return{width:e,height:e,r:s,cx:o,cy:o,strokeWidth:r,strokeDasharray:i,strokeDashOffset:n,strokeLinecap:this.isRounded?"round":"butt",fontSize:(e-r)*.22,trackColor:this.trackColor,progressColor:this.progressColor,progress:`${Math.round(t)}%`}}update(t){let{strokeDashOffset:e,trackColor:r,progressColor:s,progress:o}=this.calcParams(t),i=this.shadowRoot.querySelector(".value");i.innerText=o;let n=this.shadowRoot.querySelector(".track");n?n.style.setProperty("--track-color",r):n.style.removeProperty("--track-color");let a=this.shadowRoot.querySelector(".progress");a.setAttribute("stroke-dashoffset",e),s?a.style.setProperty("--progress-color",s):n.style.removeProperty("--progress-color")}animateProgress(t,e,r){if(!Number.isFinite(t))throw new TypeError('Argument "from" must be a number.');if(t<0||t>100)throw new RangeError('Argument "from" must be \u2265 0 and \u2264 100.');if(!Number.isFinite(e))throw new TypeError('Argument "to" must be a number.');if(e<0||e>100)throw new RangeError('Argument "to" must be \u2265 0 and \u2264 100.');if(t>e)throw new RangeError('Argument "from" must be \u2264 "to".');if(typeof r!="number"&&typeof r!="string")throw new TypeError('Argument "duration" must be a number or a string.');if(typeof r=="number"&&!r<0)throw new RangeError('Argument "duration" must be \u2265 0.');if(typeof r=="string"&&!r.match(/^([0-9]+(\.[0-9]+)?|\.[0-9]+)(s|ms)$/))throw new RangeError('Argument "duration" must be specified in seconds (s) or milliseconds (ms), like 1.5s or 250ms.');typeof r=="string"&&(r.endsWith("ms")?r=parseFloat(r):r.endsWith("s")&&(r=parseFloat(r)*1e3)),cancelAnimationFrame(this._frameId);let s=e-t,o=Date.now(),i=()=>{let a=(Date.now()-o)/r,l=t+s*a;l<e?(this.update(l),this._frameId=requestAnimationFrame(i)):(this.update(e),this.setAttribute("value",e),this._frameId=-1)};i()}render(){let{width:t,height:e,r,cx:s,cy:o,strokeWidth:i,strokeDasharray:n,strokeDashOffset:a,strokeLinecap:l,fontSize:b,trackColor:u,progressColor:f,progress:y}=this.calcParams(this.value),m=document.createElement("style");m.innerText=k,this.shadowRoot||this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=g`
      <svg
        viewBox="0 0 ${t} ${e}"
        width="${t}"
        height="${e}"
      >
        <circle
          class="track"
          style="${u?`--track-color: ${u}`:""}"
          r="${r}"
          cx="${s}"
          cy="${o}"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="${i}"
          stroke-dasharray="${n}"
        ></circle>
        <circle
          class="progress"
          style="${f?`--progress-color: ${f}`:""}"
          r="${r}"
          cx="${s}"
          cy="${o}"
          fill="none"
          stroke="#22c55e"
          stroke-width="${i}"
          stroke-dasharray="${n}"
          stroke-dashoffset="${a}"
          stroke-linecap="${l}"
        ></circle>
      </svg>
      <span class="value" style="font-size: ${b}px">${y}</span>
    `,this.shadowRoot.prepend(m)}attributeChangedCallback(t){t==="size"||t==="track-width"||t==="rounded"?this.render():(t==="value"||t==="track-color"||t==="progress-color")&&this.update(this.value)}};d("circular-progress-bar",h);})();
