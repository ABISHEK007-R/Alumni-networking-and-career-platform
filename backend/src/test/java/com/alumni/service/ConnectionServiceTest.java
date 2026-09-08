package com.alumni.service;

import com.alumni.entity.Connection;
import com.alumni.entity.ConnectionStatus;
import com.alumni.entity.User;
import com.alumni.repository.ConnectionRepository;
import com.alumni.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConnectionServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private ConnectionRepository connectionRepository;

    @InjectMocks
    private ConnectionService connectionService;

    @Test
    void sendRequest_shouldRejectSelfConnection() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> connectionService.sendRequest(7L, 7L));

        org.assertj.core.api.Assertions.assertThat(ex.getMessage()).contains("cannot connect with yourself");
    }

    @Test
    void sendRequest_shouldRejectDuplicatePendingRequest() {
        User sender = User.builder().id(1L).email("sender@example.com").name("Sender").role(User.Role.STUDENT).build();
        User receiver = User.builder().id(2L).email("receiver@example.com").name("Receiver").role(User.Role.ALUMNI).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(connectionRepository.existsBySenderIdAndReceiverIdAndStatusIn(1L, 2L, java.util.List.of(ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED)))
                .thenReturn(false);
        when(connectionRepository.existsBySenderIdAndReceiverIdAndStatusIn(2L, 1L, java.util.List.of(ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED)))
                .thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> connectionService.sendRequest(1L, 2L));

        org.assertj.core.api.Assertions.assertThat(ex.getMessage()).contains("already exists");
    }
}
