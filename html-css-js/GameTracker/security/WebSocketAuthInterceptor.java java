package com.zyane.gt.security;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {
    private final JwtUtil jwt;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        var acc = StompHeaderAccessor.wrap(message);
        if (StompCommand.CONNECT.equals(acc.getCommand())) {
            String auth = acc.getFirstNativeHeader("Authorization");
            if (auth != null && auth.startsWith("Bearer ")) {
                try {
                    var claims = jwt.validate(auth.substring(7));
                    acc.setUser(() -> claims.getSubject());
                } catch (Exception e) {
                    throw new IllegalArgumentException("Invalid JWT");
                }
            } else {
                throw new IllegalArgumentException("Missing JWT");
            }
        }
        return message;
    }
}
