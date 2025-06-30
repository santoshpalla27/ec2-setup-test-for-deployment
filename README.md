in this type of setup where we use nginx for api calls instead of env variable and nor the public ip is requied 

 frontend:
    build:
      context: ./mern/frontend
      args:
        VITE_API_URL: ""


we update the nginx config to proxy pass the api requests to /record 

        # Proxy API requests to your backend server
        location /record {
            proxy_pass http://backend:5050;


so because there is a empty string in env  it uses nginx for api calls 

so the url will be http://ip/record




the frontend will get server the traffic which comes to the frontend target group and when there is a request on /api the backend target group will server the traffic so where the backend container goes down the it will be only marked on backend target group only and other instances backend will server the traffic

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn = data.aws_acm_certificate.existing.arn
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener" "http_redirect" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"  # Permanent redirect
    }
  }
}

resource "aws_lb_listener_rule" "backend_api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/record", "/record/*" , "/health"]
    }
  }
}



# target group for the ALB for frontend
resource "aws_lb_target_group" "frontend" {
  name = "main-target-group"
  port = 80
  protocol = "HTTP"
  vpc_id = aws_vpc.main.id

  health_check {
    enabled = true
    interval = 30
    path = "/health"
    port = "80"
    protocol = "HTTP"
    timeout = 5
    healthy_threshold = 3
    unhealthy_threshold = 3
    matcher =  "200-299"
  }
}

resource "aws_lb_target_group" "backend" {
  name = "backend-target-group"
  port = 5050
  protocol = "HTTP"
  vpc_id = aws_vpc.main.id

  health_check {
    enabled = true
    interval = 30
    path = "/health"  # Health check on your backend API endpoint
    port = "5050"
    protocol = "HTTP"
    timeout = 5
    healthy_threshold = 3
    unhealthy_threshold = 3
    matcher = "200-299"
  }

  tags = {
    Name = "backend-target-group"
  }
}




