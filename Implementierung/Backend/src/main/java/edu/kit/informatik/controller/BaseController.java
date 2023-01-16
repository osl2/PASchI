package edu.kit.informatik.controller;

import edu.kit.informatik.service.BaseService;

import java.util.List;

public abstract class BaseController<Entity, Dto> {

    BaseService<Entity, Dto> service;

    public Dto add(Dto dto){
        return this.service.add(dto);
    }

    public Dto update(Dto dto) {
        return this.service.update(dto);
    }
    public Dto getById(long id){
        return this.service.getById(id);
    }
    public List<Dto> getAll(){
        return this.service.getAll();
    }
    public long delete(long id){
        return this.service.delete(id);
    }


}
