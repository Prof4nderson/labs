error id: file:///D:/labs_2-corrigido/labs_2-main/backend/src/main/java/com/exemplo/labsbackend/controller/AiController.java:org/springframework/http/ResponseEntity#
file:///D:/labs_2-corrigido/labs_2-main/backend/src/main/java/com/exemplo/labsbackend/controller/AiController.java
empty definition using pc, found symbol in pc: org/springframework/http/ResponseEntity#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 188
uri: file:///D:/labs_2-corrigido/labs_2-main/backend/src/main/java/com/exemplo/labsbackend/controller/AiController.java
text:
```scala
package com.exemplo.labsbackend.controller;



import com.exemplo.labsbackend.service.AiService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.@@ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody PromptRequest request) {
        String response = aiService.generateResponse(request.getPrompt());
        return ResponseEntity.ok(response);
    }

    @Data
    public static class PromptRequest {
        private String prompt;
    }
}
```


#### Short summary: 

empty definition using pc, found symbol in pc: org/springframework/http/ResponseEntity#