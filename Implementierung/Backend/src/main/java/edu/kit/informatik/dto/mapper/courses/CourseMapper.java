package edu.kit.informatik.dto.mapper.courses;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.userdata.courses.Course;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseMapper implements IModelDtoMapper<Course, CourseDto> {

    @Override
    public CourseDto modelToDto(Course course) {
        return null;
    }

    @Override
    public List<CourseDto> modelToDto(List<Course> courses) {
        return null;
    }

    @Override
    public Course dtoToModel(CourseDto courseDto) {
        return null;
    }

    @Override
    public List<Course> dtoToModel(List<CourseDto> courseDtos) {
        return null;
    }
}
