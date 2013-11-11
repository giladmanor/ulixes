Ulixes::Application.routes.draw do
  
  get 'api(/:action(/:id))(.:format)' , :controller=>:api
  get 'admin(/:action)(.:format)' , :controller=>:admin
  
  get '(/:action(/:entity(/:id)))(.:format)', :controller=>:lsd
  
  
end
