var processor={
	donothing:(e)=>{return[!0,e]},
	macro_comment_process:(e)=>{
		const t=new Map;let r=-1,n="",a="",c="";try{for(;++r<e.length;){const s=e[r];switch(s){case"$":for(;!["{","("].includes(e[++r]);)n+=e[r];for(;!["}",")"].includes(e[++r]);)a+=e[r];"}"==e[r]?t.set(n,a):")"==e[r]&&(c+=(t.get(n)||"").replaceAll("@",a)),n="",a="";break;case"/":if("*"==e[r+1]){for(r++;("*"!=e[r]||"/"!=e[r+1])&&r+1<e.length;)r++;r++}else c+=s;break;default:c+=s}}}catch(s){return[!1,""]}return[!0,c]
	}
};

function bf_compile(t,r="",n=processor.donothing){
	let a;if([a,t]=n(t),!a)return[!1,"Processor exception"];const c=131071;let s="",o=-1,l=0,f=0,h=new Array(256).fill(0);const i=new Map,u=[];for(let e=0;e<t.length;e++)if("["===t[e])u.push(e);else if("]"===t[e]){if(0===u.length)return[!1,"Unmatched ']' at pos "+e];const t=u.pop();i.set(t,e),i.set(e,t)}if(u.length>0)return[!1,"Unmatched '[' at pos "+u[u.length-1]];let g=[];for(;o<t.length;){if(g[g.length-1]>c)return[!1,"Exec exceeded max iter (131071)"];switch(t[++o]){case">":++l>=256&&(l=0);break;case"<":--l<0&&(l=255);break;case"+":h[l]=(h[l]+1)%256;break;case"-":h[l]=(h[l]-1+256)%256;break;case".":s+=String.fromCharCode(h[l]);break;case",":h[l]=(r[f++]||"\0").charCodeAt(0);break;case"[":0===h[l]?o=i.get(o):g.push(0);break;case"]":0!==h[l]?(o=i.get(o),g[g.length-1]++):g.pop()}}return[!0,s]
}