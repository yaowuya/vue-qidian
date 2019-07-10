### 启动
```js
npm run dev  //启动开发环境
npm run prod  //生产环境打包
```
### web
1. vw：1vw等于视口宽度的1%。
2. vh：1vh等于视口高度的1%。
3. vmin：选取vw和vh中最小的那个。
4. vmax：选取vw和vh中最大的那个。

### nginx 配置
```nginx
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        server_name  39.108.227.35;
        #root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;
		
		proxy_redirect off;
		# 把host头传过去，后端服务程序将收到your.domain.name, 否则收到的是localhost:8080
		proxy_set_header Host $host;
		proxy_set_header  X-Real-IP  $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
		
        location  / {
			root  /root/qidian/web/dist/;		
			index index.html index.htm;	
			#官网介绍设置这条可以解决history路由的问题
			try_files $uri $uri/ @router;
        }
		
		location  /chapterapi/ {
			proxy_pass http://chapter2.zhuishushenqi.com/chapter/http://vip.zhuishushenqi.com/;
			
        }
		
		location /api/ {
			proxy_pass http://api.zhuishushenqi.com/;
        }
        
		
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2 default_server;
#        listen       [::]:443 ssl http2 default_server;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers HIGH:!aNULL:!MD5;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        location / {
#        }
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}

```

