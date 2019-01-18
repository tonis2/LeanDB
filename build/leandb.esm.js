class e{constructor(e,t,s){return this.createTransaction(e,t,s)}async createTransaction(e,t,s){const r=await e,n=await r.transaction(t,s);return await n}}class t{constructor(e,t,s){this.name=e,this.version=t,this.db=s}async add(t){return new Promise(async(s,r)=>{const n=await new e(this.db,this.name,"readwrite"),a=await n.objectStore(this.name).put(t);a.onerror=(e=>{r(e.target.error.message)}),a.onsuccess=(e=>{this.db.observer&&this.db.observer({method:"add",source:a.source.name,key:e.target.result}),s(e.target.result)})})}delete(t){return new Promise(async s=>{const r=await new e(this.db,this.name,"readwrite"),n=await r.objectStore(this.name).openCursor();n.onsuccess=(e=>{const r=e.target.result;if(r){Object.keys(t).map(e=>Object.is(r.value[e],t[e])).filter(e=>!e).length<1&&(r.delete(),this.db.observer&&this.db.observer({method:"delete",source:n.source.name,key:r.key})),r.continue()}else s()})})}update(t){return this.value=(s=>new Promise(async r=>{const n=await new e(this.db,this.name,"readwrite"),a=await n.objectStore(this.name).openCursor();a.onsuccess=(e=>{const n=e.target.result;if(n){Object.keys(t).map(e=>Object.is(n.value[e],t[e])).filter(e=>!e).length<1&&(n.update(Object.assign(n.value,s)),this.db.observer&&this.db.observer({method:"update",source:a.source.name,key:n.key}),r(n.value)),n.continue()}else r(n)})})),this}async all(){return new Promise(async t=>{const s=await new e(this.db,this.name,"readwrite");(await s.objectStore(this.name)).getAll().onsuccess=(e=>{t(e.target.result)})})}async search(t,s){return new Promise(async r=>{const n=await new e(this.db,this.name,"readwrite");let a=await n.objectStore(this.name);if(t&&!t.index){const e=a.openCursor(),s=[];e.onsuccess=(e=>{const n=e.target.result;if(n){Object.keys(t).map(e=>Object.is(n.value[e],t[e])).filter(e=>!e).length<1&&s.push(n.value),n.continue()}else r(s)})}t&&t.index&&((a=a.index(t.index)).getAll(t.key,s).onsuccess=(e=>{r(e.target.result)})),t||(a.getAll(null,s).onsuccess=(e=>{r(e.target.result)}))})}}class s{constructor(e,t,s){return this.name=e,this.version=t,this.start_database(s)}start_database(e){const t=indexedDB.open(this.name,this.version||1);return new Promise((s,r)=>{t.onsuccess=(e=>{s(e.target.result)}),t.onerror=(e=>r(e.target.result)),e&&(t.onupgradeneeded=(t=>{e(t.target.result)}))})}}const r={"<":IDBKeyRange.upperBound,">":IDBKeyRange.lowerBound,is:IDBKeyRange.only};function n(e,t){let s=[...e].join(""),[,n,a]=s.match(/^([a-z]+) ([a-z<>]+)/);return{index:n,key:r[a](t)}}export default class{constructor(e){this.name=e}async init(e,r){const n=new s(this.name,this.version,e=>{Object.entries(r).forEach(async t=>{const s=t[0],r=t[1].split(","),n=/d\++/.test(r[0]);n&&(r[0]=r[0].replace("++",""));const a=await e.createObjectStore(s,{keyPath:r[0],autoIncrement:n});r.forEach(e=>{const t=/&/i.test(e);t&&(e=e.replace("&","")),a.createIndex(e,e,{unique:t})})})});return n.observer=this.observer,Object.keys(r).forEach(s=>this[s]=new t(s,e,n)),this}}export{n as query};
