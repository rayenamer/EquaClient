# 🔧 Guide Backend Spring Boot pour EQUA

## Structure du Backend

Le backend doit être créé séparément dans un dossier `backend/` au même niveau que `Frontend/`.

```
PI/
├── Frontend/        (ce projet Angular)
└── backend/         (à créer - Spring Boot)
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/equa/backend/
    │       │       ├── controller/
    │       │       ├── model/
    │       │       ├── repository/
    │       │       ├── service/
    │       │       └── config/
    │       └── resources/
    │           ├── application.properties
    │           └── data.sql
    ├── pom.xml
    └── mvnw
```

## 1. Créer le Projet Spring Boot

### Option A : Spring Initializr (Web)

1. Allez sur https://start.spring.io
2. Configurez :
   - **Project** : Maven
   - **Language** : Java
   - **Spring Boot** : 3.2.x
   - **Group** : com.equa
   - **Artifact** : backend
   - **Java** : 17
3. Ajoutez les dépendances :
   - Spring Web
   - Spring Data JPA
   - H2 Database (pour développement)
   - PostgreSQL Driver (pour production)
   - Lombok
4. Cliquez sur "Generate" et décompressez dans le dossier `backend/`

### Option B : Ligne de commande

```bash
npx @angular/cli new backend --routing --style=scss
```

## 2. Dépendances Maven (pom.xml)

```xml
<dependencies>
    <!-- Spring Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- H2 Database (dev) -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- PostgreSQL (prod) -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

## 3. Configuration (application.properties)

```properties
# Server
server.port=8080

# H2 Database (Development)
spring.datasource.url=jdbc:h2:mem:equadb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Initialize with data.sql
spring.jpa.defer-datasource-initialization=true
```

## 4. Modèle de Données (Project.java)

```java
package com.equa.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    private String modelUrl;
    private String category;
    private String imageUrl;
    private String status;
    
    @ElementCollection
    @CollectionTable(name = "project_features", 
                     joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "feature")
    private List<String> features;
}
```

## 5. Repository (ProjectRepository.java)

```java
package com.equa.backend.repository;

import com.equa.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCategory(String category);
    List<Project> findByStatus(String status);
}
```

## 6. Service (ProjectService.java)

```java
package com.equa.backend.service;

import com.equa.backend.model.Project;
import com.equa.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
    
    public List<Project> getProjectsByCategory(String category) {
        return projectRepository.findByCategory(category);
    }
    
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }
    
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
```

## 7. Contrôleur (ProjectController.java)

```java
package com.equa.backend.controller;

import com.equa.backend.model.Project;
import com.equa.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public List<Project> getProjectsByCategory(@PathVariable String category) {
        return projectService.getProjectsByCategory(category);
    }
    
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
```

## 8. Configuration CORS (WebConfig.java)

```java
package com.equa.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 9. Données Initiales (data.sql)

Créez `src/main/resources/data.sql` :

```sql
-- EQUA Token
INSERT INTO projects (name, description, model_url, category, image_url, status) 
VALUES (
    'EQUA Token',
    'Le token natif de l''écosystème EQUA, offrant stabilité et utilité pour la microfinance décentralisée.',
    '/assets/models/equa-token.glb',
    'Tokenomics',
    '/assets/images/equa-coin.png',
    'Active'
);

INSERT INTO project_features (project_id, feature) VALUES 
(1, 'Parité initiale 1 EQUA = 1 TND'),
(1, 'Prix dynamique basé sur l''offre et la demande'),
(1, 'Récompenses pour les validateurs de réseau'),
(1, 'Investissements tokenisés');

-- Micro-prêts
INSERT INTO projects (name, description, category, status) 
VALUES (
    'Micro-prêts',
    'Système automatisé de micro-crédits via smart contracts pour les populations non bancarisées.',
    'Finance',
    'Active'
);

INSERT INTO project_features (project_id, feature) VALUES 
(2, 'Émission automatique de prêts'),
(2, 'Remboursements transparents'),
(2, 'Taux d''intérêt équitables'),
(2, 'Pas de garantie requise');

-- Portefeuille Digital
INSERT INTO projects (name, description, category, status) 
VALUES (
    'Portefeuille Digital',
    'Portefeuille numérique sécurisé pour gérer vos tokens, épargnes et investissements.',
    'Wallet',
    'Coming Soon'
);

INSERT INTO project_features (project_id, feature) VALUES 
(3, 'Interface simple et intuitive'),
(3, 'Sécurité end-to-end'),
(3, 'Transferts P2P instantanés'),
(3, 'Multi-devises');

-- Investissements Tokenisés
INSERT INTO projects (name, description, category, status) 
VALUES (
    'Investissements Tokenisés',
    'Accédez à des opportunités d''investissement via des actifs tokenisés (immobilier, actions).',
    'Investment',
    'Coming Soon'
);

INSERT INTO project_features (project_id, feature) VALUES 
(4, 'Immobilier tokenisé'),
(4, 'Actions fractionnées'),
(4, 'Rendements transparents'),
(4, 'Liquidité améliorée');
```

## 10. Classe Principale (BackendApplication.java)

```java
package com.equa.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
```

## 🚀 Lancer le Backend

### Windows (PowerShell)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Linux/Mac
```bash
cd backend
./mvnw spring-boot:run
```

## 🧪 Tester l'API

### Avec curl
```bash
curl http://localhost:8080/api/projects
```

### Avec le navigateur
```
http://localhost:8080/api/projects
http://localhost:8080/api/projects/1
```

### Console H2
```
http://localhost:8080/h2-console
```

## 📡 Endpoints Disponibles

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/projects` | Liste tous les projets |
| GET | `/api/projects/{id}` | Récupère un projet par ID |
| GET | `/api/projects/category/{category}` | Projets par catégorie |
| POST | `/api/projects` | Crée un nouveau projet |
| DELETE | `/api/projects/{id}` | Supprime un projet |

## 🔐 Sécurité (à ajouter)

Pour la production, ajoutez :
- Spring Security
- JWT Authentication
- Rate Limiting
- Input Validation

## 🗄️ PostgreSQL (Production)

Modifiez `application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/equadb
spring.datasource.username=votre_username
spring.datasource.password=votre_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

---

**Backend prêt pour EQUA ! 🚀**
