Ulixes::Application.routes.draw do
  
  root :to => 'admin#login'
  
  get 'api(/:action(/:id))' , :controller=>:api
  
  post 'admin(/:action)' , :controller=>:admin
  get 'admin(/:action)' , :controller=>:admin
  
  get 'list(/:entity)', :controller=>:lsd, :action=>:list
  get 'grid(/:entity)', :controller=>:lsd, :action=>:list 
  post '(/:action(/:entity(/:id)))', :controller=>:lsd
  
  
end
