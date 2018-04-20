package com.codeup.services;

import com.codeup.models.UserWithRoles;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.codeup.repositories.Users;
import com.codeup.models.User;


@Service
public class UserDetailsLoader implements UserDetailsService {
    private final Users users;


    public UserDetailsLoader(Users users) {
                this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = users.findByUserName(username);

        if(user == null) {
            throw new UsernameNotFoundException("User could not be found for " + username);
        }

        return new UserWithRoles(user);

    }
}
