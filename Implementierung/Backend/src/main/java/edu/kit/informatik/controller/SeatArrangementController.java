package edu.kit.informatik.controller;

import edu.kit.informatik.dto.userdata.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.service.SeatArrangementService;
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
 * Controller für {@link SeatArrangement Sitzordnungen}
 *
 * @author ugqbo
 * @version 1.0
 */
@RestController
@RequestMapping(path = "/api/seatarrangement")
@CrossOrigin
public class SeatArrangementController extends BaseController<SeatArrangement, SeatArrangementDto, SeatArrangementDto> {
    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param seatArrangementService {@link SeatArrangementService}
     */
    public SeatArrangementController(SeatArrangementService seatArrangementService) {
        super(seatArrangementService);
    }

    @Override
    @PostMapping
    public SeatArrangementDto add(@RequestBody SeatArrangementDto seatArrangementDto) {
        return super.add(seatArrangementDto);
    }

    @Override
    @PutMapping
    public SeatArrangementDto update(@RequestBody SeatArrangementDto seatArrangementDto) {
        return super.update(seatArrangementDto);
    }

    @Override
    @GetMapping(path = "/{id}")
    public SeatArrangementDto getById(@PathVariable("id") String id) {
        return super.getById(id);
    }

    @Override
    @GetMapping
    public List<SeatArrangementDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public String delete(@RequestParam String id) {
        return super.delete(id);
    }
}
