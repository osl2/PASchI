package edu.kit.informatik.controller;

import edu.kit.informatik.dto.courses.SeatArrangementDto;
import edu.kit.informatik.model.userdata.courses.SeatArrangement;
import edu.kit.informatik.service.SeatArrangementService;
import jakarta.websocket.server.PathParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
public class SeatArrangementController extends BaseController<SeatArrangement, SeatArrangementDto> {
    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse
     * @param seatArrangementService {@link SeatArrangementService}
     */
    public SeatArrangementController(SeatArrangementService seatArrangementService) {
        this.service = seatArrangementService;
    }

    @Override
    @PostMapping
    public SeatArrangementDto add(SeatArrangementDto seatArrangementDto) {
        return super.add(seatArrangementDto);
    }

    @Override
    @PutMapping
    public SeatArrangementDto update(SeatArrangementDto seatArrangementDto) {
        return super.update(seatArrangementDto);
    }

    @Override
    @GetMapping(path = "id")
    public SeatArrangementDto getById(@PathParam("id") long id) {
        return super.getById(id);
    }

    @Override
    @GetMapping
    public List<SeatArrangementDto> getAll() {
        return super.getAll();
    }

    @Override
    @DeleteMapping
    public long delete(long id) {
        return super.delete(id);
    }
}
