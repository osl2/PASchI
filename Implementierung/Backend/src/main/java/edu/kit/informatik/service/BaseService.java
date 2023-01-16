package edu.kit.informatik.service;

import java.util.List;

@org.springframework.stereotype.Service
public interface BaseService<Entity,Dto> {

    Dto add(Dto dto);
    Dto update(Dto dto);
    Dto getById(long id);
    List<Dto> getAll();
    long delete(long id);

}