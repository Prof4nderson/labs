# Estágio de Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Baixa dependências primeiro para aproveitar o cache de camadas.
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
#COPY --from=build /app/target/*.jar app.jar
COPY target/ai-backend-0.0.1-SNAPSHOT.jar app.jar
# Container roda com usuário sem privilégios.
RUN addgroup -S labs && adduser -S labs -G labs && chown labs:labs /app/app.jar
USER labs

EXPOSE 8081
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
