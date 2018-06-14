package com.codeup.blog.controllers;


import com.codeup.blog.models.Response;
import com.codeup.blog.models.ResponseError;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sendinblue.Sendinblue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Value("${send-in-blue-apiv2}")
    private String apiKey;

    @PostMapping("")
    public Response sendContactEmail(@RequestBody String jsonStr) {

        try {
            JsonNode passedData = strToJsonNode(jsonStr);


            String name =  passedData.path("name").toString();
            String email =  passedData.path("email").toString();
            String phone =  passedData.path("phone").toString();
            String message =  passedData.path("message").toString();


            // send json response to issues
            Sendinblue http = new Sendinblue("https://api.sendinblue.com/v2.0", apiKey);

            Map< String, Object > data = new HashMap<>();
            data.put("from", new String [] {"miller.l.dane@gmail.com","Dane Miller!"});
            data.put("subject", "Personal Site Contact " + name);
            data.put("html", "" +
                    "" +
                    "Name: " + name + "<br>" +
                    "Email: " + email + "<br>" +
                    "Phone: " + phone + "<br>" +
                    "Message: " + message + "<br>" +
                    "This is the <h1>HTML MESSAGE</h1>");

            Map < String, String > to = new HashMap <> ();
            to.put("unfaiyted@gmail.com", "Dane Miller");
            Map < String, String > cc = new HashMap <> ();
            cc.put("unfaiyted@gmail.com", "Dane Miller");

            Map < String, String > headers = new HashMap <> ();
            headers.put("Content-Type", "text/html; charset=iso-8859-1");

            data.put("to", to);
            data.put("cc", cc);
            data.put("replyto", new String [] {"unfaiyted@gmail.com","reply to!"});
            data.put("from", new String [] {"unfaiyted@gmail.com","from email!"});

            data.put("text", "This is text");
            data.put("headers", headers);

            String test = http.send_email(data);
            System.out.println(test);
            System.out.println(" ");



        } catch(IOException err) {
            // fill map with errors here
            return new ResponseError();
        }

        Response res = new Response();
        res.setSuccess(true);
        return res;



    }

    // package json node mapping from string
    private JsonNode strToJsonNode(String jsonStr)  throws IOException {

        jsonStr = jsonStr.replaceAll("^\"|\"$|\\\\", "");
        ObjectMapper mapper = new ObjectMapper();
        JsonNode actualNode = mapper.readTree(jsonStr);

        return actualNode;
    }


}