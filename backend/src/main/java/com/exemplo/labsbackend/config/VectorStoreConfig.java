package com.exemplo.labsbackend.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.URI;

@Configuration
public class VectorStoreConfig {

    // As credenciais do banco vem do mesmo datasource da aplicacao (variaveis de ambiente).
    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${labs.vector.table:documents}")
    private String table;

    @Value("${labs.vector.dimension:1536}")
    private int dimension;

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        // jdbc:postgresql://host:porta/base -> host / porta / base
        URI uri = URI.create(datasourceUrl.substring("jdbc:".length()));
        String host = uri.getHost() != null ? uri.getHost() : "postgres";
        int port = uri.getPort() > 0 ? uri.getPort() : 5432;
        String path = uri.getPath() != null ? uri.getPath().replaceFirst("^/", "") : "";
        String database = path.isBlank() ? "ai_db" : path.split("\\?")[0];

        return PgVectorEmbeddingStore.builder()
                .host(host)
                .port(port)
                .database(database)
                .user(username)
                .password(password)
                .table(table)
                .dimension(dimension)
                .build();
    }
}
