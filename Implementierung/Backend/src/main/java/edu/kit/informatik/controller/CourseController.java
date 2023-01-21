package edu.kit.informatik.controller;

import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.service.CourseService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller für {@link Course Kurse}
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@RequestMapping(path = "/api/course")
public class CourseController extends BaseController<Course, CourseDto> {

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param courseService {@link CourseService}
     */
    public CourseController(CourseService courseService) {
        super(courseService);
    }

    @Override
    @PostMapping
    public CourseDto add(CourseDto courseDto) {
        return super.add(courseDto);
    }

    @Override
    @PutMapping
    public CourseDto update(CourseDto courseDto) {
        return super.update(courseDto);
    }

    @Override
    @GetMapping(path = "/{id}")
    public CourseDto getById(@PathVariable("id") String id) {
        return super.getById(id);
    }

    @Override
    @GetMapping
    public List<CourseDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public String delete(String id) {
        return super.delete(id);
    }
}
