package com.example.hoversprite.user;

import com.example.hoversprite.user.User;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.example.hoversprite.Role.Role;
import com.example.hoversprite.oauthAPI.AuthenticationProvider;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class CustomUserDeserializer extends JsonDeserializer<User> {
    @Override
    public User deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);

        User user = new User();

        if (node.has("id")) {
            user.setId(node.get("id").asLong());
        }

        user.setLastName(getTextValue(node, "lastName"));
        user.setMiddleName(getTextValue(node, "middleName"));
        user.setFirstName(getTextValue(node, "firstName"));
        user.setPhone(getTextValue(node, "phone"));
        user.setAddress(getTextValue(node, "address"));
        user.setEmail(getTextValue(node, "email"));

        String authProviderStr = getTextValue(node, "authenticationProvider");
        if (authProviderStr != null) {
            try {
                user.setAuthenticationProvider(AuthenticationProvider.valueOf(authProviderStr));
            } catch (IllegalArgumentException e) {
                // Handle invalid AuthenticationProvider value
                // You might want to log this or handle it in some way
            }
        }

        if (node.has("enabled")) {
            user.setEnabled(node.get("enabled").asBoolean());
        }

        Set<Role> roles = new HashSet<>();
        JsonNode rolesNode = node.get("roles");
        if (rolesNode != null && rolesNode.isArray()) {
            for (JsonNode roleNode : rolesNode) {
                if (roleNode.isTextual()) {
                    Role role = new Role();
                    role.setName(roleNode.asText());
                    roles.add(role);
                }
            }
        }
        user.setRoles(roles);

        return user;
    }

    private String getTextValue(JsonNode node, String fieldName) {
        JsonNode fieldNode = node.get(fieldName);
        return fieldNode != null && !fieldNode.isNull() ? fieldNode.asText() : null;
    }
}
