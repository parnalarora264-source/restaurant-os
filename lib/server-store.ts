export type Order={id:string;table:string;customer:string;items:{name:string;qty:number;price:number}[];total:number;status:'New'|'Preparing'|'Ready'|'Completed';createdAt:string};
let orders:Order[]=[];
export function getOrders(){return orders}
export function createOrder(o:Omit<Order,'id'|'createdAt'|'status'>){const order:Order={...o,id:'ORD-'+Math.random().toString(36).slice(2,8).toUpperCase(),createdAt:new Date().toISOString(),status:'New'};orders=[order,...orders];return order}
export function updateOrder(id:string,status:Order['status']){orders=orders.map(o=>o.id===id?{...o,status}:o);return orders.find(o=>o.id===id)}
