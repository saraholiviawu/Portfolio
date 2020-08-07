// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Fill array with comments data. First query the database and sort in descending order for timestamp      
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    
    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      long id = entity.getKey().getId();
      String name = (String) entity.getProperty("name"); //Eventually replace with username stored in database
      String email = (String) entity.getProperty("email");
      String address = (String) entity.getProperty("address");
      String text = (String) entity.getProperty("text");
      long timestamp = (long) entity.getProperty("timestamp");

      Comment singleComment = new Comment(id, name, email, address, text, timestamp);
      comments.add(singleComment);
    }
    // Get data from URL passed by comment.html
    int showComments = showCommentsStrToInt(request);
    // Ensure maxComments is not greater than the existing number of comments
    if (comments.size() < showComments) {
     showComments = comments.size();
    }
    
    // Remove comments that do not fit within maxComments
    for (int i = comments.size() - 1; i > showComments - 1; i--) {
      comments.remove(i);
    }

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(comments));
  }

  /** Returns the choice entered by the user, or -1 if the choice was invalid. */
  private int showCommentsStrToInt(HttpServletRequest request) {
    // Get the input from the form.
    String showCommentsString = getParameter(request, "show-comments", "");
    // Convert the input to an int.
    int showComments;
    try {
      showComments = Integer.parseInt(showCommentsString);
    } catch (NumberFormatException e) {
      System.err.println("Could not convert to int: " + showCommentsString);
      return -1;
    }
    return showComments;
  }

  /**
  * @return the request parameter, or the default value if the parameter
  *         was not specified by the client
  */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }

  public final class Comment {
    private final long id;
    private final String name;
    private final String email;
    private final String address;
    private final String text;
    private final long timestamp;

    public Comment(long id, String name, String email, String address, String text, long timestamp) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.address = address;
      this.text = text;
      this.timestamp = timestamp;
    }
  }

}
