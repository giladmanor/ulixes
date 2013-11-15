Ulixes::Application.routes.draw do
  
  get 'api(/:action(/:id))' , :controller=>:api
  
  post 'admin(/:action)' , :controller=>:admin
  get 'admin(/:action)' , :controller=>:admin
  
  post '(/:action(/:entity(/:id)))', :controller=>:lsd
  
  
end
