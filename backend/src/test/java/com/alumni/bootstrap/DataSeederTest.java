package com.alumni.bootstrap;

import com.alumni.entity.User;
import com.alumni.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class DataSeederTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DataSeeder dataSeeder;

    @Test
    void shouldSeedUsersWhenDatabaseIsEmpty() {
        userRepository.deleteAll();

        dataSeeder.seedIfEmpty();

        assertThat(userRepository.count()).isGreaterThan(0);
        assertThat(userRepository.findByEmailIgnoreCase("student@example.com")).isPresent();
        assertThat(userRepository.findByEmailIgnoreCase("alumni@example.com")).isPresent();
        assertThat(userRepository.findByEmailIgnoreCase("alumni2@example.com")).isPresent();
    }
}
