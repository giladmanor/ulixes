class ClusterController < AdminController
  
  
  def list_nodes
    @nodes = @account.nodes
    
  end
  
  def node
    @node = @account.nodes.find(params[:id])
  end
  
  def node_aggregation
    @node = @account.nodes.find(params[:id])
    render :node_aggregation, :layout=>false
  end
  
  def node_markov
    @node = @account.nodes.find(params[:id])
    render :node_markov, :layout=>false
  end
  
  def node_paragons
    @nodes = @account.nodes.map{|n| {:id=>n.id, :name=>n.name,:v=>n.vector, :p=>0}}
    @node = @account.nodes.find(params[:id])
    @node.users.find_each{|u|
      @nodes.sort{|a,b| u.distance(b[:v]) <=> u.distance(a[:v])}.first[:p] +=1 
    }
    
    @dim = @account.gmm_dimentions
    s = Sparse.new(@dim)
    @node.users.each{|user|
      s<<user.vector
    }
    p = s.initiate
    p1 = p.map{|c| c}
    
    p_a = []
    pp=[]
    10.times{|i|
      p "-"*20 + i.to_s
      pp = s.vote(p)
      p = pp
    }
    
    @paragons = s.paragon_population(pp)
    
    render :node_paragons, :layout=>false
  end
    
  def gmm_nodes
    @res = {}
    @paragons = @account.gmm_paragons true
    @nodes = @account.nodes
    @users = {}
    
    @account.nodes.each{|node|
      @res[node.id] = {}
      @paragons.each{|p| 
        @res[node.id][p] = 0
      }
      node.users.each{|u|
        paragon = @paragons.sort{|a,b| u.distance(b) <=> u.distance(a)}.last
        @res[node.id][paragon] +=1
        @users[paragon] = @users[paragon].nil? ? u : (u.distance(paragon)<@users[paragon].distance(paragon) ? u : @users[paragon])
      }
      
    }
    logger.debug @users
  end
  
  def paragon
    @persona = @account.find_user(params[:id])
    paragons = @account.gmm_paragons true
    @paragon = paragons.sort{|a,b| @persona.distance(b) <=> @persona.distance(a)}.last
    @paragon_info = @account.paragon_info(@paragon)
    logger.debug "%"*20
    logger.debug @paragon_info.inspect
    logger.debug "%"*20
  end
  
  def persona_insight
    name = params[:name]
    @vector = {}
    params[:vector].each{|k,v|
      @vector[k] = v.to_f
    }
    @nodes = @account.nodes.sort{|a,b| User.distance(b.vector,@vector)<=>User.distance(a.vector,@vector)}
    
    @paragons = @account.gmm_paragons true
    @res = {}
    @users = {}
    
    @account.nodes.each{|node|
      @res[node.id] = {}
      @paragons.each{|p| 
        @res[node.id][p] = 0
      }
      node.users.each{|u|
        paragon = @paragons.sort{|a,b| u.distance(b) <=> u.distance(a)}.last
        @res[node.id][paragon] +=1
        @users[paragon] = @users[paragon].nil? ? u : (u.distance(paragon)<@users[paragon].distance(paragon) ? u : @users[paragon])
      }
      
    }
    
    @populations = @account.nodes.map{|n| {:name=>n.name, :size=>@res[n.id][@vector]}}
    render :layout=>false
  end
  
  def calculations
    
  end
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  def gmm
    #s=Sparse.read "vector_data.txt"
    @dim = @account.gmm_dimentions true
    
    logger.debug @dim.length
    
    s = Sparse.new(@dim)
    @account.users.each{|user|
      s<<user.vector
    }
    
    logger.debug "Users are vectorized"
    
    #users = s.points.map{|c| {:type=>"User", :a=>c[0],:b=>c[1]}}
    p = s.initiate#Array.new(100,[7.5,7.5]).map{|c| [c[0]+Random.rand(10).to_f/100,c[1]+Random.rand(10).to_f/100] }
    p1 = p.map{|c| c}
    
    p_a = []
    pp=[]
    10.times{|i|
      p "-"*20 + i.to_s
      pp = s.vote(p)
      p = pp
    }
    
    @paragons = s.paragon_population(pp)
    @suggested_paragons = []#s.initiate
  end
  
  
  def show
    @cluster = params[:id].present? ? @account.clusters.find(params[:id]) : Cluster.new(params[:cluster])
    @require = require_statement
  end
  
  def set
    @cluster = params[:id].present? ? @account.clusters.find(params[:id]) : Cluster.new
    @cluster.name=params[:name]
    @cluster.requirement = params[:requirement].reject{|r| r.empty?}
    @account.clusters << @cluster
    @require = require_statement
    render :show, :id=>@cluster.id
  end
  
  def require_statement
    operands = {"is"=>[],"not"=>[], "grater then"=>[],"lesser then"=>[]}
    regexp = {"starts with"=>[],"end_with"=>[], "contains"=>[],"equals"=>[],"expression"=>[]}
    
    scales = {}
    @account.scales.each{|s| scales[s.code]=operands}
    badges =  @account.badges.map{|b| b.name} #terminating Array
    value_type = {"with Value"=>operands,"with Value Sum"=>operands, "with Code"=>regexp}
    { 
      "if user has event"=>value_type,
      "if user has Flag"=>value_type,
      Rule::IF_USER_SCALE=>scales,
      Rule::IF_USER_HAS_BADGE=>badges,
      Rule::UNLESS_USER_HAS_BADGE=>badges
    }
  end
  
  def vectorise
    
  end
  
  #####################################################################################
  
  def spread
    
  end
  
  def get_node_clusters
    # clusters = {} 
    # paragons = @account.users.suffle.take(@account.clusters.size)
    # i=0
    # @account.clusters.each{|cluster|
      # clusters[cluster.id]={:size=>0, :paragon=>paragons[i].vector}
      # i+=1
    # }
#     
    # nodes=@account.nodes.map{|n| 
      # spread = clusters
      # n.users.each{|u| 
        # d = paragons.sort{|a,b| User.distance(a,u)<=>User.distance(b,u)}
      # }
      # {:name=>u.uid, :size=>1,:children=>[]}
#       
      # {:name=>n.name, :size=>n.users.size, :children=>spread}
    # }
#     
    # res = {:name=>"root",:size=>@account.users.size, :children=>nodes}
    res = {
      :name=>"",
      :size=>@account.users.size,
      :pc=>1,
      :children=>@account.nodes.map{|n| 
        nu = n.users.size
        logger.debug nu
        {
          :name=>n.name, 
          :size=>nu, 
          :pc=>(nu.to_f / @account.users.size),
          :children=>@account.clusters.map{|c| 
            {
              :name=>c.name, 
              :pc=> [0.3,0.5,0.2].shuffle.first,
              :size=>10,
              :children=>[]
            }
          }
        }
      }
    }
    
    render :json=>res
  end
  
  
  #####################################################################################
  
  
  def mark
    
  end
  
  
end
