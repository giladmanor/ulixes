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
    p = Array.new(100,[7.5,7.5]).map{|c| [c[0]+Random.rand(10).to_f/100,c[1]+Random.rand(10).to_f/100] }
    p1 = p.map{|c| c}
    
    p_a = []
    pp=[]
    10.times{|i|
      p "-"*20 + i.to_s
      pp = s.vote(p)
      p = pp
    }
    
    f = s.clean_empty_paragons(pp)
    res = (users + f.map.with_index{|c,i| {:type=>"F#{i}", :a=>c[0],:b=>c[1]}})
    render :json=>res
  end
  
  
  
  

end
