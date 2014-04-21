class VisualAidController < AdminController
  def index

  end

  def show
    render params[:id]
  end

  def get_node_trace
    node = @account.nodes.find(params[:id])
    size = node.users.size
    render :json=>{:name=>node.name,:size=>size,:actions=>node.events_sum}
  end

  def get_node_dependancy
    node_names = @account.nodes.map{|n| n.name}
    node_ids = @account.nodes.map{|n| n.id}

    transitions = @account.users.map{|u| u.flags.where(:code=>"_TRANSITION").map{|e| e.value.to_i}}.flatten

    dependencies =node_ids.map{|nid| node_ids.map{|nidd| 0}}
    transitions.map{|eid|
      edge = @account.edges.find(eid)
      dependencies[node_ids.index(edge.target_id)][node_ids.index(edge.source_id)] +=1
    }
    logger.debug dependencies.inspect

    render :json=>{:nodes=>node_names, :dependencies=>dependencies}
  end

  def get_node_clusters
    #vectors = @account.users.map{|u| u.vector}
    
    
    render :json=>{:name=>"root",:size=>@account.users.size, :children=>@account.nodes.map{|n| {:name=>n.name, :size=>n.users.size, :children=>n.users.map{|u| {:name=>u.uid, :size=>1,:children=>[]}}}}}
  end
  
  

  def get_node_funnels
    node_names = @account.nodes.map{|n| {:name=>n.name}}
    node_ids = @account.nodes.map{|n| n.id}

    transitions = @account.users.map{|u| u.flags.where(:code=>"_TRANSITION").map{|e| e.value.to_i}}.flatten

    dependencies ={}
    transitions.map{|eid|
      dependencies[eid] = (dependencies[eid] || 0) + 1
    }
    tmp_nodes = []
    edges = dependencies.map{|k,v|
      edge = @account.edges.find(k)
      unless tmp_nodes.index(edge.target_id)
        tmp_nodes << edge.source_id
        {:value=>v}.merge({:source=>node_ids.index(edge.source_id),:target=>node_ids.index(edge.target_id)})
      else
        nil
      end
    }.compact
    res = {:nodes=>node_names, :edges=>edges}
    logger.debug res.inspect
    render :json=>res
  end
  
  
  
  ######################################################################################
  
  def get_vector_visuals
    s=Sparse.read "vector_data.txt"
    users = s.points.map{|c| {:type=>"User", :a=>c[0],:b=>c[1]}}
    #p=[[6,6],[6.1,6],[6,6.1],[6.1,6.1],[6.1,5.9]]#,[6,4],[6,5],[6,6],[6,7]]
    #p=[[7.4,7.5],[7.6,7.5],[7.5,7.4],[7.5,7.6],[7.5,7.7]]
    p = Array.new(10,[7.5,7.5]).map{|c| [c[0]+Random.rand(10).to_f/100,c[1]+Random.rand(10).to_f/100] }
    p1 = p.map{|c| c}
    res = p.map{|c| {:type=>"S", :a=>c[0],:b=>c[1]}}
    
    p_a = []
    pp=[]
    20.times{|i|
      p "-"*20 + i.to_s
      pp = s.vote(p)
      #p_a = p.map{|c| {:type=>"C#{i}", :a=>c[0],:b=>c[1]}}
      p = pp
    }
    
    
    res = (users + (pp-p1).map{|c| {:type=>"F", :a=>c[0],:b=>c[1]}})
    render :json=>res
  end
  
  
  
  

end
