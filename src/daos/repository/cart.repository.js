class CartRepository{
    constructor(dao){
        this.dao=dao;
    }

    //Abstraemos los métodos
    async createCart(){
        return await this.dao.addCart();
    };

    async getCartById(id){
        return await this.dao.getCartById(id);
    };

    async addProductToCart(cartId, productId){
        return await this.dao.addProductToCart(cartId, productId);
    };

    async updateCart(cartId, cart){
        return await this.dao.updateCart(cartId, cart);
    };

    async deleteCartProduct(cartId,productId){
        return await this.dao.deleteProduct(cartId,productId);
    };

    async updateQuantityInCart(cartId, productId, quantity){
        return await this.dao.updateQuantityInCart(cartId, productId, quantity);
    };
}

export {CartRepository};