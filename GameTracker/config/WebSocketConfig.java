package com.zyane.gt.config;
import com.zyane.gt.security.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final WebSocketAuthInterceptor wsAuth;

    @Override public void configureMessageBroker(MessageBrokerRegistry r) {
        r.enableSimpleBroker("/topic", "/queue");
        r.setApplicationDestinationPrefixes("/app");
        r.setUserDestinationPrefix("/user");
    }
    @Override public void registerStompEndpoints(StompEndpointRegistry r) {
        r.addEndpoint("/ws/match").setAllowedOriginPatterns("*").withSockJS();
    }
    @Override public void configureClientInboundChannel(ChannelRegistration r) {
        r.interceptors(wsAuth);
    }
}
