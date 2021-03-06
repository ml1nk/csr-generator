package mlink.csr_generator;

import android.Manifest;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.util.Base64;
import android.webkit.DownloadListener;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.Charset;

/**
 * Created by mlink on 6/30/17.
 */

public class MyDownloadListener implements DownloadListener {

    Activity ac;

    public MyDownloadListener(Activity ac) {
        this.ac = ac;
    }

    @Override
    public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength){

        if(!isStoragePermissionGranted()) {
            return;
        }

        if(!isStorageAvailable()) {
            Toast.makeText(ac.getApplicationContext(), "Das Speichermedium ist aktuell nicht verfügbar, versuchen Sie es später noch einmal.", Toast.LENGTH_LONG).show();
            return;
        }

        File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS);
        String[] tmp = url.split(",",2);
        String[] name = tmp[0].split("name=",2)[1].split(",|;",2)[0].split("\\.(?=[^\\.]+$)");

        path = new File(path,"csr-generator");

        if(!path.exists()) {
            path.mkdirs();
        }

        byte[] data = null;

        if(tmp[0].endsWith("base64")) {
            data = Base64.decode(tmp[1],Base64.DEFAULT);
        } else {
            try {
                data = URLDecoder.decode(tmp[1],"UTF-8").getBytes(Charset.forName("UTF-8"));
            } catch (UnsupportedEncodingException e) {
                data = tmp[1].getBytes(Charset.forName("UTF-8"));
            }
        }

        String type = tmp[0].split(";",2)[0].substring(5);

        File file = new File(path, name[0]+"."+name[1]);
        int count = 0;

        while(file.exists()) {
            count++;
            file = new File(path, name[0]+"("+count+")."+name[1]);
        }

        try {
            FileOutputStream stream = new FileOutputStream(file, true);
            stream.write(data);
            stream.flush();
            stream.close();


            DownloadManager downloadManager = (DownloadManager)ac.getSystemService(ac.DOWNLOAD_SERVICE);
            downloadManager.addCompletedDownload(file.getName(), "csr-generator", true, type, file.getAbsolutePath(),file.length(),true);




        } catch (IOException e) {
            Toast.makeText(ac.getApplicationContext(), "Datei konnte nicht gespeichert werden: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    public boolean isStorageAvailable() {
        return Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState());
    }

    public boolean isStoragePermissionGranted() {
        if (Build.VERSION.SDK_INT >= 23) {
            if (ac.checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_GRANTED) {
                return true;
            } else {
                ActivityCompat.requestPermissions(ac, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                return false;
            }
        }
        return true;
    }
}
