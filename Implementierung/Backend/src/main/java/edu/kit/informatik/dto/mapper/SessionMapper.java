package edu.kit.informatik.dto.mapper;

import edu.kit.informatik.dto.userdata.courses.SessionDto;
import edu.kit.informatik.model.userdata.courses.Session;

import java.util.List;

public class SessionMapper implements IModelDtoMapper<Session, SessionDto> {

    @Override
    public SessionDto modelToDto(Session session) {
        return null;
    }

    @Override
    public List<SessionDto> modelToDto(List<Session> sessions) {
        return null;
    }

    @Override
    public Session dtoToModel(SessionDto sessionDto) {
        return null;
    }

    @Override
    public List<Session> dtoToModel(List<SessionDto> sessionDtos) {
        return null;
    }
}
