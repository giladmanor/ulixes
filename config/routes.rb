class DomainConstraint
  def initialize(domain)
    @domains = [domain].flatten
  end

  def matches?(request)
    @domains.include? request.domain
  end
end

Ulixes::Application.routes.draw do
  
  constraints DomainConstraint.new('quizic.co') do
    root :to => 'quizic#home', :as=>"quizic"
    
  end
  root :to => 'site#index'
  
    
  
  get 'login',:controller=>:admin,:action=>:login
  
  get 'api(/:action(/:id))' , :controller=>:api
  post 'api(/:action(/:id))' , :controller=>:api
  
  get 'batch(/:action(/:id))' , :controller=>:batch
  
  post 'admin(/:action(/:id))' , :controller=>:admin
  get 'admin(/:action(/:id))' , :controller=>:admin
  get 'config' , :controller=>:admin, :action=>:configuration
  get 'creator' , :controller=>:admin, :action=>:creator
  
  post 'gmm(/:action(/:id))' , :controller=>:gmm
  get 'gmm(/:action(/:id))' , :controller=>:gmm
  
  
  get 'list(/:entity(/:id))', :controller=>:lsd, :action=>:list
  get 'grid(/:entity)', :controller=>:lsd, :action=>:list
  
  get 'graph(/:action(/:id))', :controller=>:graph
  
  get 'mockup(/:action)', :controller=>:mockup
  post 'mockup(/:action)', :controller=>:mockup
  
  post 'show/Notification(/:id)', :controller=>:notification, :action=>:show
  get 'show/Notification(/:id)', :controller=>:notification, :action=>:show
  post 'set/notification(/:id)', :controller=>:notification, :action=>:set
  get 'notification(/:action)', :controller=>:notification
  post 'notification(/:action)', :controller=>:notification
  
  post 'show/Cluster(/:id)', :controller=>:cluster, :action=>:show
  post 'cluster(/:action(/:id))', :controller=>:cluster
  get 'cluster(/:action(/:id))', :controller=>:cluster
  
  get 'visual_aid(/:action(/:id))', :controller=>:visual_aid
  post 'show/User(/:id)', :controller=>:admin, :action=>:user_tester
  
  post 'wb(/:action(/:id))', :controller=>:wb
  get 'wb(/:action(/:id))', :controller=>:wb
  
  
  post '(/:action(/:entity(/:id)))', :controller=>:lsd
  
  
  
  
end
