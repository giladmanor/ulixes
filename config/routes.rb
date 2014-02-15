Ulixes::Application.routes.draw do
  
  root :to => 'admin#login'
  
  get 'api(/:action(/:id))' , :controller=>:api
  
  post 'admin(/:action)' , :controller=>:admin
  get 'admin(/:action)' , :controller=>:admin
  get 'config' , :controller=>:admin, :action=>:configuration
  
  get 'list(/:entity)', :controller=>:lsd, :action=>:list
  get 'grid(/:entity)', :controller=>:lsd, :action=>:list
  get 'graph(/:action)', :controller=>:graph
  get 'mockup(/:action)', :controller=>:mockup
  post 'mockup(/:action)', :controller=>:mockup
  post 'show/Notification(/:id)', :controller=>:notification, :action=>:show
  get 'notification(/:action)', :controller=>:notification
  get 'visual_aid(/:action(/:id))', :controller=>:visual_aid
  
  post '(/:action(/:entity(/:id)))', :controller=>:lsd
  
  
  
  
end
