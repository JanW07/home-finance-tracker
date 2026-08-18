# --- Etap 1: budowanie aplikacji (Maven) ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Najpierw same zależności - lepszy cache warstw Dockera
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Etap 2: lekki obraz uruchomieniowy (tylko JRE) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Użytkownik nie-root ze względów bezpieczeństwa
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]