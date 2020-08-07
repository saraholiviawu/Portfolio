
package com.google.servlets;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.blobstore.FileInfo;
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
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.Storage.CopyRequest;
import com.google.cloud.storage.StorageOptions;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.nio.channels.Channels;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;


@WebServlet("/upload")
public class Upload extends HttpServlet {
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
  
  public void doPost(HttpServletRequest req, HttpServletResponse res)
      throws ServletException, IOException {
      // Assume file is already available as blob-key
      Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
      List<BlobKey> blobKeys = blobs.get("myFile");
      System.out.println(blobstoreService.getFileInfos(req));
      Map<String, List<FileInfo>> files = blobstoreService.getFileInfos(req);
    //   Storage storage = StorageOptions.getDefaultInstance().getService();
    //   storage.copy(CopyRequest.of(BlobId.of("bucket-testing-1", files.get("myFile").get(0).getGsObjectName().substring(21)), 
    //       BlobId.of("bucket-testing-1", "1.jpg")));
      if (blobKeys == null || blobKeys.isEmpty()) {
            res.sendRedirect("/");
      } else {
            res.sendRedirect("/serve?blob-key=" + blobKeys.get(0).getKeyString());
      }
  }
}

  // Write a file to cloud storage or overwrites it if if a file with same name already exists
//   @Override
//   public void doPost(HttpServletRequest req, HttpServletResponse res) 
//       throws IOException {
//     // Get fileInfo and then filename from req, serve directly first for testing
//     // Return FileInfo for any uploaded files, keyed by upload form "name" field
//     // contains created filename in Cloud Storage
//     Map<String, List<FileInfo>> files = blobstoreService.getFileInfos(req);
//     String fileName = req.getParameter("myFile");
//     System.out.println(fileName);
//     // String fileName = "";
//     // for (String key: files.keySet()) {
//     // String fileName = files.get("myFile").get(0).getFileName();
//     // //   break;
//     // }
//     // String fileName = files.get(0).getFilename();
    // List<FileInfo> fileNames = files.getFilename();
//     res.sendRedirect("/serve?fileName=" + blobKeys.get);
//   }

  // Current doPost gets the upload and directly outputs it at the url "/serve"
  
    // @Override
    // public void doPost(HttpServletRequest req, HttpServletResponse res)
    //     throws ServletException, IOException {
    //     // Issue: don't serve most recent image
    //     Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
    //     List<BlobKey> blobKeys = blobs.get("myFile");
    //     // store key ^^ in datastore a map of user ids and 
    //     if (blobKeys == null || blobKeys.isEmpty()) {
    //         res.sendRedirect("/");
    //     } else {
    //         res.sendRedirect("/serve?blob-key=" + blobKeys.get(0).getKeyString());
    //     }
    // }
    

//     private GcsFilename getFileName(HttpServletRequest req) {
//     String[] splits = req.getRequestURI().split("/", 4);
//     if (!splits[0].equals("") || !splits[1].equals("gcs")) {
//       throw new IllegalArgumentException("The URL is not formed as expected. " +
//           "Expecting /gcs/<bucket>/<object>");
//     }
//     return new GcsFilename(splits[2], splits[3]);
//   }
