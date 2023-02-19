package edu.kit.informatik.controller;

import edu.kit.informatik.dto.userdata.courses.CourseDto;
import edu.kit.informatik.model.userdata.courses.Course;
import edu.kit.informatik.service.CourseService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller für {@link Course Kurse}
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/course")
public class CourseController extends BaseController<Course, CourseDto, CourseDto> {

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param courseService {@link CourseService}
     */
    public CourseController(CourseService courseService) {
        super(courseService);
    }

    @Override
    @PostMapping
    public CourseDto add(@RequestBody CourseDto courseDto, Authentication authentication) {
        return super.add(courseDto, authentication);
    }

    @Override
    @PutMapping
    public CourseDto update(@RequestBody CourseDto courseDto, Authentication authentication) {
        return super.update(courseDto, authentication);
    }

    @Override
    @GetMapping(path = "/{id}")
    public CourseDto getById(@PathVariable("id") String id, Authentication authentication) {
        return super.getById(id, authentication);
    }

    @Override
    @GetMapping
    public List<CourseDto> getAll(Authentication authentication) {
        return super.getAll(authentication);
    }

    @Override
    @DeleteMapping
    public String delete(@RequestParam String id, Authentication authentication) {
        return super.delete(id, authentication);
    }
}
