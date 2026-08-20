# Estágio de Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia EXATAMENTE o artifact principal gerado pelo Maven
COPY --from=build /app/target/ai-backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Ajusta permissões do usuário sem privilégios
RUN addgroup -S labs && adduser -S labs -G labs && chown -R labs:labs /app
USER labs

EXPOSE 8081
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
