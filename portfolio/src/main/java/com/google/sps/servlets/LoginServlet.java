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
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
// Servlet returns True when user is logged in and generates a logoutUrl 
// Servlet returns False when user is NOT logged in and generates a loginUrl
// Use Gson
@WebServlet("/login")
public class LoginServlet extends HttpServlet {
  private String urlToRedirectToAfter = "/comments.html";

  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    System.out.print("called doGet");
    UserService userService = UserServiceFactory.getUserService();
    boolean isUserLoggedIn = false;
    String logoutUrl = "";
    String loginUrl = "";
    String currUserEmail = "";
    if (userService.isUserLoggedIn()) {
      System.out.print("user is logged in");
      isUserLoggedIn = true;
      System.out.print(isUserLoggedIn);
      logoutUrl = userService.createLogoutURL(urlToRedirectToAfter);
      currUserEmail = userService.getCurrentUser().getEmail();
    } else {
      System.out.print("user is not logged in");
      isUserLoggedIn = false;
      loginUrl = userService.createLoginURL(urlToRedirectToAfter);
    }

    UserInfo userInfo = new UserInfo(isUserLoggedIn, logoutUrl, loginUrl, currUserEmail);

    Gson gson = new Gson();
    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(userInfo));
  }

  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }

  public final class UserInfo {
    private final boolean isUserLoggedIn;
    private final String logoutUrl;
    private final String loginUrl;
    private final String currUserEmail;

    public UserInfo(boolean isUserLoggedIn, String logoutUrl, String loginUrl, String currUserEmail) {
      this.isUserLoggedIn = isUserLoggedIn;
      this.logoutUrl = logoutUrl;
      this.loginUrl = loginUrl;
      this.currUserEmail = currUserEmail;
    }
  }

}