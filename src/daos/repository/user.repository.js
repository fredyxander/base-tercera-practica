class UserRepository{
    constructor(dao){
        this.dao = dao;
    }

    async addUser(user){
        return await this.dao.addUser(user);
    };

    async getUserByEmail(email){
        return await this.dao.getUserByEmail(email);
    };

    async updateUser(id, user){
        return await this.dao.updateUser(id, user);
    };

    async getUserById(id){
        return await this.dao.getUserById(id);
    };
}

export { UserRepository }