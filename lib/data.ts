export type Category='Pizza'|'Burgers'|'Pasta'|'Momos'|'Garlic & Sides'|'Fries'|'Coffee'|'Drinks'|'Desserts';
export type MenuItem={id:string;name:string;category:Category;description:string;price:number;image:string;veg?:boolean;featured?:boolean;badge?:string};
export const menu:MenuItem[]=[
{id:'margherita',name:'Classic Margherita',category:'Pizza',description:'Tomato, mozzarella, basil and olive oil.',price:299,image:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',veg:true,featured:true,badge:'Signature'},
{id:'pepperoni',name:'Pepperoni House',category:'Pizza',description:'Crisp pepperoni, mozzarella and our slow-cooked tomato sauce.',price:399,image:'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80',featured:true,badge:'Bestseller'},
{id:'truffle',name:'Truffle Mushroom',category:'Pizza',description:'Roasted mushrooms, mozzarella, herbs and truffle oil.',price:449,image:'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=80',veg:true,featured:true},
{id:'alfredo',name:'Creamy Alfredo',category:'Pasta',description:'Silky parmesan cream, garlic, herbs and cracked pepper.',price:349,image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80',veg:true},
{id:'smash',name:"Rolly's Smash",category:'Burgers',description:'Double smashed patties, house sauce, cheese and pickles.',price:329,image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',featured:true},
{id:'garlic',name:'Garlic Knots',category:'Garlic & Sides',description:'Baked knots tossed in garlic butter and parsley.',price:179,image:'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=900&q=80',veg:true},
{id:'fries',name:'Parmesan Fries',category:'Fries',description:'Crispy fries, parmesan, herbs and house seasoning.',price:199,image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',veg:true},
{id:'espresso',name:'Espresso',category:'Coffee',description:'Bold, short and beautifully balanced.',price:129,image:'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80',veg:true},
{id:'latte',name:'Café Latte',category:'Coffee',description:'Smooth espresso with velvety steamed milk.',price:189,image:'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80',veg:true},
{id:'coldbrew',name:'Cold Coffee',category:'Coffee',description:'Chilled coffee, milk and a gentle sweetness.',price:199,image:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80',veg:true},
{id:'momos',name:'Loaded Momos',category:'Momos',description:'Steamed dumplings with spicy house dip.',price:229,image:'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=80'},
{id:'brownie',name:'Warm Chocolate Brownie',category:'Desserts',description:'Fudgy chocolate brownie served warm.',price:199,image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',veg:true}
];
export const categories=['All','Pizza','Burgers','Pasta','Momos','Garlic & Sides','Fries','Coffee','Drinks','Desserts'];
