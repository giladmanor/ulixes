Ulixes::Application.routes.draw do
  
  root :to => 'admin#login'
  
  get 'api(/:action(/:id))' , :controller=>:api
  post 'api(/:action(/:id))' , :controller=>:api
  
  post 'admin(/:action)' , :controller=>:admin
  get 'admin(/:action)' , :controller=>:admin
  get 'config' , :controller=>:admin, :action=>:configuration
  get 'creator' , :controller=>:admin, :action=>:creator
  
  get 'list(/:entity)', :controller=>:lsd, :action=>:list
  get 'grid(/:entity)', :controller=>:lsd, :action=>:list
  
  get 'graph(/:action(/:id))', :controller=>:graph
  
  get 'mockup(/:action)', :controller=>:mockup
  post 'mockup(/:action)', :controller=>:mockup
  
  post 'show/Notification(/:id)', :controller=>:notification, :action=>:show
  get 'show/Notification(/:id)', :controller=>:notification, :action=>:show
  post 'set/notification(/:id)', :controller=>:notification, :action=>:set
  get 'notification(/:action)', :controller=>:notification
  
  post 'show/Cluster(/:id)', :controller=>:cluster, :action=>:show
  post 'cluster(/:action)', :controller=>:cluster
  get 'cluster(/:action)', :controller=>:cluster
  
  get 'visual_aid(/:action(/:id))', :controller=>:visual_aid
  post 'show/User(/:id)', :controller=>:admin, :action=>:user_tester
  
  post 'wb(/:action(/:id))', :controller=>:wb
  get 'wb(/:action(/:id))', :controller=>:wb
  
  
  post '(/:action(/:entity(/:id)))', :controller=>:lsd
  
  
  
  
end
