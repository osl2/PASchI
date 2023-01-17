package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;

public class Teacher extends Participant {

    public Teacher(User user, String firstName, String lastName) {
        super(user, firstName, lastName);
    }

    @Override
    public boolean isStudent() {
        return false;
    }
}
