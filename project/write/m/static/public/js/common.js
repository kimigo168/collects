/**
 * Created by GIISO on 2018/1/31.
 */

var apiHost = "";
var adminApiHost = "https://backoffice.giiso.com";
if (location.host == "localhost:8083" || location.host == "172.16.1.27:8082" || location.host == "172.16.1.27:8081" || location.host == "172.16.1.27:8080") {
  // apiHost = "http://172.16.1.24:9090";
  apiHost = "http://172.16.1.147:9090";
  // apiHost = "http://aiwriter-uat.giiso.com";
  // apiHost = "https://www.giiso.com";

  // adminApiHost = "http://172.16.1.24:8094";
  // adminApiHost = "http://aiwriter-uat.giiso.com/statistics";
}
