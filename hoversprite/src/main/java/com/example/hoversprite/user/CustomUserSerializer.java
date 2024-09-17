package com.example.hoversprite.user;

import com.example.hoversprite.user.User;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.example.hoversprite.Role.Role;
import com.example.hoversprite.oauthAPI.AuthenticationProvider;
import org.springframework.security.core.GrantedAuthority;

import java.io.IOException;

public class CustomUserSerializer extends JsonSerializer<User> {
    @Override
    public void serialize(User user, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();

        if (user.getId() != null) {
            gen.writeNumberField("id", user.getId());
        }

        writeStringField(gen, "lastName", user.getLastName());
        writeStringField(gen, "middleName", user.getMiddleName());
        writeStringField(gen, "firstName", user.getFirstName());
        writeStringField(gen, "phone", user.getPhone());
        writeStringField(gen, "address", user.getAddress());
        writeStringField(gen, "email", user.getEmail());

        if (user.getAuthenticationProvider() != null) {
            gen.writeStringField("authenticationProvider", user.getAuthenticationProvider().name());
        }

        gen.writeBooleanField("enabled", user.isEnabled());

        gen.writeArrayFieldStart("roles");
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                if (role != null && role.getName() != null) {
                    gen.writeString(role.getName());
                }
            }
        }
        gen.writeEndArray();

        gen.writeEndObject();
    }

    private void writeStringField(JsonGenerator gen, String fieldName, String value) throws IOException {
        if (value != null) {
            gen.writeStringField(fieldName, value);
        }
    }
}
