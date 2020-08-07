
package com.google.servlets;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.blobstore.FileInfo;
import com.google.appengine.api.blobstore.UploadOptions;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsInputChannel;
import com.google.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.RetryParams;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.lang.Object;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.channels.Channels;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/serve")
public class Serve extends HttpServlet {
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

  // Request handler gets the bucket name and object name in the request.
  // Creates the Blobstore service and uses it to create a blob key for GCS, using supplied
  // bucket and key
//   @Override
//   public void doGet(HttpServletRequest req, HttpServletResponse res)
//       throws IOException {
//     BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
//     BlobKey blobKey = blobstoreService.createGsBlobKey(
//         "/gs/bucket-testing-1/aLfbIaY1xeCRNUWZR88e3Q");
//     blobstoreService.serve(blobKey, res);
//   }
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
        throws IOException {
            BlobKey blobKey = new BlobKey(req.getParameter("blob-key"));
            blobstoreService.serve(blobKey, res);
            
        }
}



//   // Reading a file from Cloud Storage using BlobStore API
//   @Override
//   public void doGet(HttpServletRequest req, HttpServletResponse res)
//       throws IOException {
//     BlobKey blobKey = new BlobKey(req.getParameter("blob-key"));
//     blobstoreService.serve(blobKey, res);
//     BlobKey blobKey = blobstoreService.createGsBlobKey(
//         "/gs/" + fileName.getBucketName() + "/" + fileName.getObjectName());
//         blobstoreService.serve(blobKey, resp);
//   }
